import os

try:
    with open(r'C:\Users\cristian.gomezcoello\.gemini\antigravity\brain\40989438-6674-4244-a0d3-1910b7116a53\informe_tecnico_deuna.md', 'r', encoding='utf-8') as f:
        informe = f.read()
except:
    informe = ""

try:
    with open(r'C:\Users\cristian.gomezcoello\.gemini\antigravity\brain\40989438-6674-4244-a0d3-1910b7116a53\tabla_pruebas_deuna.md', 'r', encoding='utf-8') as f:
        tabla = f.read()
except:
    tabla = ""

final_md = informe + "\n\n## 7. Tabla de Resultados Oficial (15 Preguntas de Prueba)\n\n" + tabla

with open('Entregable_4NOVA_DeUna.md', 'w', encoding='utf-8') as f:
    f.write(final_md)

print("Markdown combined successfully.")
