import pandas as pd
import json
import re

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

excel_path = 'dados/nomeacoes_oabpr_todas_comarcas_especialidades_2026-02-24_a_2026-08-24.xlsx'

# 1. Ler Especialidades
df_esp_raw = pd.read_excel(excel_path, sheet_name='Por especialidade')
header_idx = df_esp_raw[df_esp_raw.iloc[:, 0].astype(str).str.contains('Especialidade', case=False, na=False)].index[0]
df_esp = pd.read_excel(excel_path, sheet_name='Por especialidade', header=header_idx)
df_esp = df_esp.dropna(subset=[df_esp.columns[0]])
df_esp = df_esp[~df_esp.iloc[:, 0].astype(str).str.contains('Total|Fonte|Especialidade', case=False, na=False)]

# 2. Ler Análise por Comarca
df_com_raw = pd.read_excel(excel_path, sheet_name='Analise por Comarca')
header_com_idx = df_com_raw[df_com_raw.iloc[:, 1].astype(str).str.contains('Comarca', case=False, na=False)].index[0]
df_com = pd.read_excel(excel_path, sheet_name='Analise por Comarca', header=header_com_idx)
df_com.columns = [
    'Rank', 'Comarca', 'Nomeacoes', 'OABs_distintos', 'Nomeacoes_por_OAB',
    'Especialidades_ativas', 'Especialidade_dominante', 'Nomeacoes_dominante',
    'Perc_dominante', 'Score_volume', 'Score_abrangencia', 'Score_recorrencia',
    'Score_oportunidade', 'Segmento'
]
df_com = df_com.dropna(subset=['Comarca'])
df_com = df_com[~df_com['Comarca'].astype(str).str.contains('Total Geral|Fonte|Comarca', case=False, na=False)]
df_com = df_com[pd.to_numeric(df_com['Nomeacoes'], errors='coerce').notnull()]

sql_lines = [
    "-- ==============================================================================",
    "-- MATCH JURÍDICO - SCRIPT DE SEED REAL (FONTE: OAB/PR 2026 - 163 COMARCAS)",
    "-- Separação Conceitual: Score de Oportunidade (Expansão) x Deserto Jurídico (Escassez Real)",
    "-- ==============================================================================",
    "",
    "-- 1. Inserir Especialidades Reais",
]

especialidades_list = []
for idx, row in df_esp.iterrows():
    nome_esp = str(row.iloc[0]).strip()
    slug = slugify(nome_esp)
    esp_id = f"11111111-1111-1111-1111-{str(len(especialidades_list)+1).zfill(12)}"
    
    icone = 'Scale'
    if 'CRIMINAL' in nome_esp: icone = 'ShieldAlert'
    elif 'FAMÍLIA' in nome_esp or 'FAMILIA' in nome_esp: icone = 'Users'
    elif 'INFÂNCIA' in nome_esp or 'INFANCIA' in nome_esp: icone = 'Baby'
    elif 'PREVIDENCIÁRIO' in nome_esp or 'PREVIDENCIARIO' in nome_esp: icone = 'HeartPulse'
    elif 'TRABALHO' in nome_esp: icone = 'Briefcase'
    elif 'FAZENDA' in nome_esp or 'SAÚDE' in nome_esp: icone = 'Building2'

    especialidades_list.append({
        'id': f"esp-{slug}",
        'nome': nome_esp.title(),
        'slug': slug,
        'icone': icone,
        'descricao': f"Atendimento e defesa dativa especializada em {nome_esp.title()}."
    })

    sql_lines.append(
        f"INSERT INTO public.especialidades (id, nome, slug, icone, descricao) "
        f"VALUES ('{esp_id}', '{nome_esp}', '{slug}', '{icone}', 'Atuação dativa na área de {nome_esp.title()}') "
        f"ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;"
    )

sql_lines.append("\n-- 2. Inserir Comarcas Reais com Métricas da OAB/PR (Escala 0-100)")

coords = {
    'MARINGÁ': (-23.4205, -51.9331),
    'CASCAVEL': (-24.9578, -53.4595),
    'PONTA GROSSA': (-25.0994, -50.1583),
    'LONDRINA': (-23.3045, -51.1696),
    'CAMPO LARGO': (-25.4597, -49.5275),
    'FAZENDA RIO GRANDE': (-25.6592, -49.3081),
    'SÃO JOSÉ DOS PINHAIS': (-25.5347, -49.2064),
    'ARAUCÁRIA': (-25.5928, -49.4103),
    'GUARAPUAVA': (-25.3953, -51.4625),
    'ARAPONGAS': (-23.4189, -51.4244),
    'PIRAQUARA': (-25.4419, -49.0633),
    'GOIOERÊ': (-24.1847, -53.0278),
    'FOZ DO IGUAÇU': (-25.5163, -54.5854),
    'TELÊMACO BORBA': (-24.3239, -50.6156),
    'CURITIBA': (-25.4284, -49.2733),
    'PARANAGUÁ': (-25.5205, -48.5095),
    'CAPANEMA': (-25.6697, -53.8081),
    'RESERVA': (-24.6506, -50.8508),
    'IVAIPORÃ': (-24.2486, -51.6836),
    'UNIÃO DA VITÓRIA': (-26.2269, -51.0872),
}

mock_comarcas_ts = []

for idx, (_, row) in enumerate(df_com.iterrows()):
    nome = str(row['Comarca']).strip().upper()
    nomeacoes = int(float(row['Nomeacoes']))
    oabs = int(float(row['OABs_distintos'])) if pd.notnull(row['OABs_distintos']) else 1
    score_op = float(row['Score_oportunidade']) if pd.notnull(row['Score_oportunidade']) else 50.0
    score_exato = round(score_op, 2)
    
    # CRITÉRIO DE ESCASSEZ REAL (DESERTO JURÍDICO):
    # Baseado estritamente em carência absoluta de advogados no local (<= 25 OABs ativos)
    # ou sobrecarga crítica em cidades pequenas (<= 50 OABs com mais de 2.5 nomeações/advogado)
    taxa_sobrecarga = nomeacoes / max(1, oabs)
    is_deserto = oabs <= 25 or (oabs <= 50 and taxa_sobrecarga >= 2.5)
    
    lat, lng = coords.get(nome, (-24.5000 + ((idx * 7) % 300) * 0.01, -51.5000 + ((idx * 11) % 300) * 0.01))
    lat = round(lat, 6)
    lng = round(lng, 6)

    com_id = f"22222222-2222-2222-2222-{str(idx+1).zfill(12)}"
    
    sql_lines.append(
        f"INSERT INTO public.comarcas (id, nome, uf, regiao, populacao, num_advogados_ativos, total_processos_ano, score_oportunidade, latitude, longitude, raio_atendimento_sugerido_km) "
        f"VALUES ('{com_id}', '{nome.title()}', 'PR', 'Paraná', {nomeacoes * 25 + 5000}, {oabs}, {nomeacoes}, {score_exato}, {lat}, {lng}, {60 if is_deserto else 30}) "
        f"ON CONFLICT (id) DO NOTHING;"
    )

    mock_comarcas_ts.append({
        'id': f"com-{slugify(nome)}",
        'nome': nome.title(),
        'uf': 'PR',
        'regiao': 'Paraná',
        'populacao': int(nomeacoes * 25 + 5000),
        'num_advogados_ativos': oabs,
        'total_processos_ano': nomeacoes,
        'score_oportunidade': score_exato,
        'is_deserto_juridico': is_deserto,
        'latitude': lat,
        'longitude': lng,
        'raio_atendimento_sugerido_km': 60 if is_deserto else 30
    })

# Ordenar mock_comarcas_ts por score_oportunidade decrescente
mock_comarcas_ts.sort(key=lambda c: c['score_oportunidade'], reverse=True)

with open('supabase/seed.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

with open('scripts/extracted_data.json', 'w', encoding='utf-8') as f:
    json.dump({'comarcas': mock_comarcas_ts, 'especialidades': especialidades_list}, f, ensure_ascii=False, indent=2)

print(f"Critério ajustado com sucesso! {sum(1 for c in mock_comarcas_ts if c['is_deserto_juridico'])} comarcas classificadas como Desertos Reais por escassez de advogados.")
