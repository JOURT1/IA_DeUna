# -*- coding: utf-8 -*-
"""
Generador de PDF — Documentación Técnica Breve
Equipo 4NOVA — Mi Contador de Bolsillo (DeUna)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Colores corporativos ──
RED_DEUNA   = HexColor("#EB0029")
DARK_BG     = HexColor("#1A1A2E")
DARK_CARD   = HexColor("#16213E")
ACCENT_BLUE = HexColor("#0F3460")
GRAY_LIGHT  = HexColor("#F8F9FA")
GRAY_TEXT   = HexColor("#555555")
WHITE       = white

OUTPUT_FILE = "Documentacion_Tecnica_4NOVA_DeUna.pdf"

# ── Estilos personalizados ──
styles = getSampleStyleSheet()

styles.add(ParagraphStyle(
    name='CoverTitle',
    fontName='Helvetica-Bold',
    fontSize=28,
    leading=34,
    textColor=DARK_BG,
    alignment=TA_CENTER,
    spaceAfter=8,
))

styles.add(ParagraphStyle(
    name='CoverSubtitle',
    fontName='Helvetica',
    fontSize=16,
    leading=22,
    textColor=GRAY_TEXT,
    alignment=TA_CENTER,
    spaceAfter=4,
))

styles.add(ParagraphStyle(
    name='SectionTitle',
    fontName='Helvetica-Bold',
    fontSize=16,
    leading=20,
    textColor=DARK_BG,
    spaceBefore=18,
    spaceAfter=6,
    borderPadding=(0, 0, 4, 0),
))

styles.add(ParagraphStyle(
    name='SubSectionTitle',
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=ACCENT_BLUE,
    spaceBefore=12,
    spaceAfter=4,
))

styles.add(ParagraphStyle(
    name='BodyText2',
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=HexColor("#333333"),
    alignment=TA_JUSTIFY,
    spaceAfter=6,
))

styles.add(ParagraphStyle(
    name='BulletItem',
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=HexColor("#333333"),
    leftIndent=18,
    spaceAfter=3,
))

styles.add(ParagraphStyle(
    name='SmallNote',
    fontName='Helvetica-Oblique',
    fontSize=8,
    leading=10,
    textColor=GRAY_TEXT,
    alignment=TA_CENTER,
))

styles.add(ParagraphStyle(
    name='TableHeader',
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=WHITE,
    alignment=TA_CENTER,
))

styles.add(ParagraphStyle(
    name='TableCell',
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=HexColor("#333333"),
    alignment=TA_LEFT,
))

styles.add(ParagraphStyle(
    name='TableCellCenter',
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=HexColor("#333333"),
    alignment=TA_CENTER,
))

styles.add(ParagraphStyle(
    name='PhotoPlaceholder',
    fontName='Helvetica-Oblique',
    fontSize=10,
    leading=14,
    textColor=GRAY_TEXT,
    alignment=TA_CENTER,
    spaceBefore=6,
    spaceAfter=6,
))

# ── Helper: línea separadora roja ──
def red_line():
    return HRFlowable(width="100%", thickness=2, color=RED_DEUNA, spaceBefore=2, spaceAfter=8)

def thin_line():
    return HRFlowable(width="100%", thickness=0.5, color=HexColor("#DDDDDD"), spaceBefore=4, spaceAfter=8)

# ── Helper: tabla estilizada ──
def styled_table(data, col_widths=None, header_color=DARK_BG):
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor("#CCCCCC")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, GRAY_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]
    t.setStyle(TableStyle(style_cmds))
    return t

# ── Helper: foto placeholder box ──
def photo_placeholder(label, width=7*cm, height=4.5*cm):
    """Crea un rectángulo gris con texto para pegar captura."""
    data = [[Paragraph(f'<font color="#999999"><i>{label}</i></font>', styles['PhotoPlaceholder'])]]
    t = Table(data, colWidths=[width], rowHeights=[height])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), HexColor("#F0F0F0")),
        ('BORDER', (0, 0), (0, 0), 1, HexColor("#CCCCCC")),
        ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
        ('ALIGN', (0, 0), (0, 0), 'CENTER'),
        ('BOX', (0, 0), (0, 0), 1.5, HexColor("#BBBBBB")),
    ]))
    return t

def p(text, style='BodyText2'):
    return Paragraph(text, styles[style])

def bullet(text):
    return Paragraph(f"• {text}", styles['BulletItem'])

# ══════════════════════════════════════════════════════
#  BUILD DOCUMENT
# ══════════════════════════════════════════════════════
def build():
    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
    )
    W = doc.width
    story = []

    # ─────────────────────────────────────
    # PORTADA
    # ─────────────────────────────────────
    story.append(Spacer(1, 3*cm))
    story.append(p("Mi Contador de Bolsillo", 'CoverTitle'))
    story.append(red_line())
    story.append(p("Documentación Técnica Breve", 'CoverSubtitle'))
    story.append(Spacer(1, 0.6*cm))
    story.append(p("Agente Conversacional con Interfaz Chat", 'CoverSubtitle'))
    story.append(Spacer(1, 1.5*cm))

    cover_info = [
        ["Equipo", "4NOVA"],
        ["Integrantes", "Martina Damina, Jhoel Suarez,\nJuan Pereira, Justin Gomezcoello"],
        ["Reto", "Reto 2 — IA: Mi Contador de Bolsillo"],
        ["Hackathon", "Interact2Hack 2026 — DeUna"],
        ["Fecha", "Abril 2026"],
    ]
    cover_table = Table(cover_info, colWidths=[4*cm, 10*cm])
    cover_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('TEXTCOLOR', (0,0), (0,-1), ACCENT_BLUE),
        ('TEXTCOLOR', (1,0), (1,-1), HexColor("#333333")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, HexColor("#EEEEEE")),
    ]))
    story.append(cover_table)
    story.append(Spacer(1, 2*cm))
    story.append(p('<font color="#999999">Entregable: Documentación Técnica Breve · Demo Funcional con Interfaz Tipo Chat</font>', 'SmallNote'))

    story.append(PageBreak())

    # ─────────────────────────────────────
    # 1. RESUMEN EJECUTIVO
    # ─────────────────────────────────────
    story.append(p("1. Resumen Ejecutivo", 'SectionTitle'))
    story.append(red_line())
    story.append(p(
        "El micro-comerciante ecuatoriano posee datos transaccionales dentro de la app DeUna, "
        "pero carece del tiempo o la alfabetización financiera para interpretarlos mediante dashboards tradicionales. "
        "<b>Mi Contador de Bolsillo</b> transforma esta fricción en una ventaja competitiva: "
        "un <b>asesor financiero conversacional</b> capaz de responder preguntas de negocio en español "
        "natural con datos 100% precisos y en menos de 5 segundos."
    ))
    story.append(p(
        "Para el comerciante, esto significa acceso inmediato a insights (ej. «¿qué producto vendo más?»), "
        "democratizando la inteligencia de negocios. Para DeUna, representa un incremento en el engagement diario "
        "y la consolidación de la marca como el <i>asesor de confianza</i> del micro-comercio."
    ))

    # ─────────────────────────────────────
    # 2. DESCRIPCIÓN DEL ENTREGABLE
    # ─────────────────────────────────────
    story.append(p("2. Descripción del Entregable", 'SectionTitle'))
    story.append(red_line())

    entregable_data = [
        [Paragraph("<b>Campo</b>", styles['TableHeader']),
         Paragraph("<b>Detalle</b>", styles['TableHeader'])],
        [Paragraph("Entregable principal", styles['TableCell']),
         Paragraph("Agente conversacional con interfaz chat", styles['TableCell'])],
        [Paragraph("Descripción breve", styles['TableCell']),
         Paragraph("Asistente que responde preguntas de negocio sobre dataset sintético en español, "
                    "con al menos 10 tipos de consulta y respuesta menor a 5 segundos.", styles['TableCell'])],
        [Paragraph("Formato de entrega", styles['TableCell']),
         Paragraph("Demo funcional con interfaz tipo chat (aplicación web)", styles['TableCell'])],
        [Paragraph("Tipos de consulta soportados", styles['TableCell']),
         Paragraph("<b>16 intents</b> de negocio (supera el mínimo de 10)", styles['TableCell'])],
        [Paragraph("Tiempo de respuesta", styles['TableCell']),
         Paragraph("Promedio: <b>~700 ms</b> con LLM / <b>&lt;100 ms</b> sin LLM (cumple &lt;5 s)", styles['TableCell'])],
        [Paragraph("Idioma", styles['TableCell']),
         Paragraph("Español natural, tolerante a errores ortográficos y jerga ecuatoriana", styles['TableCell'])],
        [Paragraph("Dataset", styles['TableCell']),
         Paragraph("Sintético: Tienda Don Pepe (Quito) — 1,233 transacciones, 10 clientes, 8 categorías", styles['TableCell'])],
    ]
    story.append(styled_table(entregable_data, col_widths=[4*cm, W-4*cm]))

    # ─────────────────────────────────────
    # 3. ARQUITECTURA TÉCNICA
    # ─────────────────────────────────────
    story.append(p("3. Arquitectura Técnica", 'SectionTitle'))
    story.append(red_line())

    story.append(p("<b>Arquitectura Determinístico-First</b>", 'SubSectionTitle'))
    story.append(p(
        "El diseño se fundamenta en un principio clave: <b>nunca dejar que el LLM haga matemáticas</b>. "
        "Los modelos Transformer predicen el siguiente token por probabilidad lingüística, no calculan sumas. "
        "Por ello, la arquitectura separa tres capas:"
    ))
    story.append(bullet("<b>Capa 1 — Extracción de Intenciones (NLP):</b> El LLM solo extrae <i>qué quiere</i> el usuario (Intent) y <i>cuándo</i> (Date Entity)."))
    story.append(bullet("<b>Capa 2 — Cálculo Determinístico:</b> El backend de Node.js filtra el JSON con operaciones O(n) en milisegundos y calcula sumas exactas."))
    story.append(bullet("<b>Capa 3 — Generación Natural (LLM Formatter):</b> El número exacto se le pasa al LLM para que lo redacte de forma amigable."))
    story.append(p("<b>Resultado:</b> Margen de error contable de <font color='#EB0029'><b>0%</b></font>."))

    story.append(Spacer(1, 0.3*cm))
    story.append(p("<b>Diagrama de flujo</b>", 'SubSectionTitle'))
    # Diagrama simplificado como tabla
    flow_data = [
        [Paragraph('<font color="white"><b>Usuario</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>→</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>Angular Chat UI</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>→</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>Express API</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>→</b></font>', styles['TableHeader']),
         Paragraph('<font color="white"><b>Analytics Engine</b></font>', styles['TableHeader']),],
    ]
    flow_t = Table(flow_data, colWidths=[W/7]*7)
    flow_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT_BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,0), 'MIDDLE'),
        ('BOX', (0,0), (-1,0), 1, ACCENT_BLUE),
        ('INNERGRID', (0,0), (-1,0), 0.5, HexColor("#335599")),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
    ]))
    story.append(flow_t)
    story.append(Spacer(1, 0.2*cm))
    # Sub-flujo
    sub_flow = [
        [Paragraph("Intent Router (regex + LLM)", styles['TableCellCenter']),
         Paragraph("LLM Adapter (reformula)", styles['TableCellCenter']),
         Paragraph("Proactive Alerts", styles['TableCellCenter']),
         Paragraph("JSON Dataset (memoria)", styles['TableCellCenter']),],
    ]
    sub_t = Table(sub_flow, colWidths=[W/4]*4)
    sub_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor("#E8EDF3")),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('BOX', (0,0), (-1,0), 0.5, HexColor("#AABBCC")),
        ('INNERGRID', (0,0), (-1,0), 0.5, HexColor("#CCCCCC")),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
    ]))
    story.append(sub_t)

    # ─────────────────────────────────────
    # 4. STACK TECNOLÓGICO
    # ─────────────────────────────────────
    story.append(p("4. Stack Tecnológico", 'SectionTitle'))
    story.append(red_line())

    stack_data = [
        [Paragraph("<b>Componente</b>", styles['TableHeader']),
         Paragraph("<b>Tecnología</b>", styles['TableHeader']),
         Paragraph("<b>Justificación</b>", styles['TableHeader'])],
        [Paragraph("Frontend", styles['TableCell']),
         Paragraph("Angular 20 (Standalone)", styles['TableCell']),
         Paragraph("Framework empresarial con tipado estricto y componentes reactivos", styles['TableCell'])],
        [Paragraph("Backend / API", styles['TableCell']),
         Paragraph("Node.js + Express + TypeScript", styles['TableCell']),
         Paragraph("Asincronía no bloqueante, ideal para I/O de APIs y BD", styles['TableCell'])],
        [Paragraph("Motor NLP / LLM", styles['TableCell']),
         Paragraph("OpenAI API (GPT-4o-mini)", styles['TableCell']),
         Paragraph("Latencia ~700 ms, costo $0.00015/query, comprensión del español", styles['TableCell'])],
        [Paragraph("Analítica", styles['TableCell']),
         Paragraph("Funciones determinísticas JS", styles['TableCell']),
         Paragraph("Zero-dependencies: cálculos puros sobre arreglos JSON", styles['TableCell'])],
        [Paragraph("Visualizaciones", styles['TableCell']),
         Paragraph("CSS-based charts (barras, pie, tablas)", styles['TableCell']),
         Paragraph("Sin librerías externas; renderizado inline en respuestas del chat", styles['TableCell'])],
        [Paragraph("Framework de Agentes", styles['TableCell']),
         Paragraph("LLM-Adapter nativo (custom)", styles['TableCell']),
         Paragraph("Se descartó LangChain/LlamaIndex por overhead y latencia", styles['TableCell'])],
    ]
    story.append(styled_table(stack_data, col_widths=[3*cm, 4.5*cm, W-7.5*cm]))

    # ─────────────────────────────────────
    # 5. TIPOS DE CONSULTA SOPORTADOS
    # ─────────────────────────────────────
    story.append(p("5. Tipos de Consulta Soportados (16 Intents)", 'SectionTitle'))
    story.append(red_line())
    story.append(p("El sistema soporta <b>16 intent types</b> de negocio, superando ampliamente el mínimo de 10 requerido:"))

    intents_data = [
        [Paragraph("<b>#</b>", styles['TableHeader']),
         Paragraph("<b>Intent</b>", styles['TableHeader']),
         Paragraph("<b>Ejemplo de pregunta</b>", styles['TableHeader']),
         Paragraph("<b>Función analítica</b>", styles['TableHeader'])],
        [p("1", 'TableCellCenter'), p("sales_today", 'TableCell'), p("¿Cuánto vendí hoy?", 'TableCell'), p("getSalesToday()", 'TableCell')],
        [p("2", 'TableCellCenter'), p("sales_specific_date", 'TableCell'), p("¿Cuánto vendí el 17 de abril?", 'TableCell'), p("getSalesForDate()", 'TableCell')],
        [p("3", 'TableCellCenter'), p("sales_this_week", 'TableCell'), p("¿Cuánto vendí esta semana?", 'TableCell'), p("getSalesForPeriod('week')", 'TableCell')],
        [p("4", 'TableCellCenter'), p("sales_this_month", 'TableCell'), p("¿Cuánto vendí este mes?", 'TableCell'), p("getSalesForPeriod('month')", 'TableCell')],
        [p("5", 'TableCellCenter'), p("sales_comparison", 'TableCell'), p("¿Cómo voy vs el mes pasado?", 'TableCell'), p("comparePeriods()", 'TableCell')],
        [p("6", 'TableCellCenter'), p("best_day", 'TableCell'), p("¿Cuál fue mi mejor día?", 'TableCell'), p("getBestDay()", 'TableCell')],
        [p("7", 'TableCellCenter'), p("worst_day", 'TableCell'), p("¿Cuál fue mi peor día?", 'TableCell'), p("getWorstDay()", 'TableCell')],
        [p("8", 'TableCellCenter'), p("average_ticket", 'TableCell'), p("¿Cuál es mi ticket promedio?", 'TableCell'), p("getAverageTicket()", 'TableCell')],
        [p("9", 'TableCellCenter'), p("customer_churn", 'TableCell'), p("¿Qué clientes no han vuelto?", 'TableCell'), p("getChurnRisk()", 'TableCell')],
        [p("10", 'TableCellCenter'), p("repeat_customers", 'TableCell'), p("¿Quiénes compran más seguido?", 'TableCell'), p("getRepeatCustomers()", 'TableCell')],
        [p("11", 'TableCellCenter'), p("strong_weak_days", 'TableCell'), p("¿Qué días son más fuertes?", 'TableCell'), p("getDayOfWeekAnalysis()", 'TableCell')],
        [p("12", 'TableCellCenter'), p("sales_trend", 'TableCell'), p("¿Cómo va la tendencia?", 'TableCell'), p("getSalesTrend()", 'TableCell')],
        [p("13", 'TableCellCenter'), p("significant_change", 'TableCell'), p("¿Hubo alguna caída o subida?", 'TableCell'), p("detectSignificantChange()", 'TableCell')],
        [p("14", 'TableCellCenter'), p("top_products", 'TableCell'), p("¿Qué es lo que más vendo?", 'TableCell'), p("getTopProducts()", 'TableCell')],
        [p("15", 'TableCellCenter'), p("payment_methods", 'TableCell'), p("¿Cómo pagan mis clientes?", 'TableCell'), p("getPaymentBreakdown()", 'TableCell')],
        [p("16", 'TableCellCenter'), p("proactive_alert", 'TableCell'), p("Dame un consejo para mi negocio", 'TableCell'), p("Proactive Alerts Engine", 'TableCell')],
    ]
    story.append(styled_table(intents_data, col_widths=[1*cm, 3.3*cm, 5*cm, W-9.3*cm]))

    story.append(PageBreak())

    # ─────────────────────────────────────
    # 6. ROBUSTEZ Y MANEJO DE ERRORES
    # ─────────────────────────────────────
    story.append(p("6. Robustez y Manejo de Errores", 'SectionTitle'))
    story.append(red_line())
    story.append(p("El sistema aborda la imprevisibilidad del input humano con <b>tolerancia a fallos en cascada</b> (Graceful Degradation):"))
    story.append(bullet(
        '<b>Errores ortográficos extremos:</b> Un comerciante escribe «caunto bendi aller». '
        'El LLM NLP capta el contexto y extrae el intent correcto (<i>sales_specific_date</i>).'
    ))
    story.append(bullet(
        '<b>Vacíos de datos (Zero-State):</b> Si no hay ventas, el motor devuelve count: 0 y el LLM '
        'genera un mensaje motivacional: «Hoy aún no tienes ventas. ¡Ánimo!».'
    ))
    story.append(bullet(
        '<b>Caché inteligente (LLMCache):</b> Si múltiples usuarios hacen la misma pregunta, '
        'se resuelve localmente en ~2 ms sin llamar a OpenAI.'
    ))
    story.append(bullet(
        '<b>Modo offline (noop):</b> Sin API key de OpenAI, el sistema funciona con templates directos, '
        'garantizando disponibilidad total.'
    ))

    # ─────────────────────────────────────
    # 7. SELECCIÓN DE MODELOS LLM
    # ─────────────────────────────────────
    story.append(p("7. Selección de Modelo LLM", 'SectionTitle'))
    story.append(red_line())

    model_data = [
        [Paragraph("<b>Modelo</b>", styles['TableHeader']),
         Paragraph("<b>Latencia</b>", styles['TableHeader']),
         Paragraph("<b>Costo/query</b>", styles['TableHeader']),
         Paragraph("<b>Precisión NLU</b>", styles['TableHeader']),
         Paragraph("<b>Veredicto</b>", styles['TableHeader'])],
        [p("Llama-3 (70B/8B)", 'TableCell'), p("~2 s (GPU)", 'TableCellCenter'), p("Infra propia", 'TableCellCenter'), p("Alta", 'TableCellCenter'), p("Requiere GPU dedicada", 'TableCell')],
        [p("Claude 3.5 Haiku", 'TableCell'), p("~800 ms", 'TableCellCenter'), p("$0.00025", 'TableCellCenter'), p("Media-Alta", 'TableCellCenter'), p("12% falsos positivos en jerga", 'TableCell')],
        [p("GPT-4 Turbo", 'TableCell'), p("~1.5 s", 'TableCellCenter'), p("$0.01", 'TableCellCenter'), p("Excelente", 'TableCellCenter'), p("Excesivo costo para B2C", 'TableCell')],
        [p("<b>GPT-4o-mini ✓</b>", 'TableCell'), p("<b>~700 ms</b>", 'TableCellCenter'), p("<b>$0.00015</b>", 'TableCellCenter'), p("<b>Excelente</b>", 'TableCellCenter'), p("<b>Elegido: mejor costo-beneficio</b>", 'TableCell')],
    ]
    story.append(styled_table(model_data, col_widths=[3.2*cm, 2.3*cm, 2.3*cm, 2.5*cm, W-10.3*cm]))

    # ─────────────────────────────────────
    # 8. DATASET DE PRUEBA
    # ─────────────────────────────────────
    story.append(p("8. Dataset Sintético de Prueba", 'SectionTitle'))
    story.append(red_line())

    dataset_data = [
        [Paragraph("<b>Dato</b>", styles['TableHeader']),
         Paragraph("<b>Valor</b>", styles['TableHeader'])],
        [p("Comercio evaluado", 'TableCell'), p("Tienda Don Pepe", 'TableCell')],
        [p("Giro de negocio", 'TableCell'), p("Abarrotes / tienda de barrio", 'TableCell')],
        [p("Ciudad", 'TableCell'), p("Quito", 'TableCell')],
        [p("Rango histórico", 'TableCell'), p("1 de mayo de 2024 al 18 de abril de 2025", 'TableCell')],
        [p("Transacciones completadas", 'TableCell'), p("<b>1,233</b>", 'TableCell')],
        [p("Total histórico vendido", 'TableCell'), p("<b>$34,235.80</b>", 'TableCell')],
        [p("Clientes frecuentes", 'TableCell'), p("10", 'TableCell')],
        [p("Categorías", 'TableCell'), p("granos, bebidas, lácteos, panadería, enlatados, aceites, snacks, limpieza", 'TableCell')],
        [p("Método de pago", 'TableCell'), p("DeUna", 'TableCell')],
    ]
    story.append(styled_table(dataset_data, col_widths=[4.5*cm, W-4.5*cm]))

    # ─────────────────────────────────────
    # 9. RESULTADOS DE PRUEBA (15 preguntas)
    # ─────────────────────────────────────
    story.append(PageBreak())
    story.append(p("9. Set de Pruebas — 15 Preguntas (Tasa de Acierto: 100%)", 'SectionTitle'))
    story.append(red_line())
    story.append(p(
        "Se validaron <b>15 inputs</b> contra el motor analítico determinístico. "
        "Cada respuesta se evaluó en: detección de intención, dato numérico exacto y claridad para un micro-comerciante. "
        "La columna <b>Evidencia</b> se completa con capturas de pantalla durante la demo."
    ))

    tests = [
        ("1", "¿Cuánto vendí hoy?", "$68.27 / 4 txns", "Sí"),
        ("2", "¿Cuánto vendí el 17 de abril?", "$211.79 / 6 txns", "Sí"),
        ("3", "¿Cuánto vendí esta semana?", "$434.20 / 17 txns", "Sí"),
        ("4", "¿Cuánto vendí este mes?", "$2,034.56 / 66 txns", "Sí"),
        ("5", "¿Cómo voy vs el mes pasado?", "Abr $2,034.56 vs Mar $3,580.98 → -43.2%", "Sí"),
        ("6", "¿Cuál fue mi mejor día?", "Lun 3/Mar/2025 con $375.24", "Sí"),
        ("7", "¿Qué clientes no han vuelto?", "0 en riesgo (todos activos)", "Sí"),
        ("8", "¿Quiénes son mis clientes más frecuentes?", "Carlos Mendoza: 149 compras, $3,992.74", "Sí"),
        ("9", "¿Cuál es mi ticket promedio?", "$27.77 sobre 1,233 ventas", "Sí"),
        ("10", "¿Qué días vendo más?", "Jueves $29.64 promedio (mejor)", "Sí"),
        ("11", "¿Cómo va la tendencia?", "Baja: $132.19 → $74.40 (-43.7%)", "Sí"),
        ("12", "¿Qué es lo que más vendo?", "Granos: $9,310.11", "Sí"),
        ("13", "¿Cómo pagan mis clientes?", "DeUna: $34,235.80 / 1,233 txns", "Sí"),
        ("14", "Dame un consejo", "Alerta: caída -43.7%, recomendaciones", "Sí"),
        ("15", "caunto bendi aller", "$211.79 / 6 txns (tolera errores)", "Sí"),
    ]

    test_header = [
        Paragraph("<b>#</b>", styles['TableHeader']),
        Paragraph("<b>Input probado</b>", styles['TableHeader']),
        Paragraph("<b>Resultado esperado / obtenido</b>", styles['TableHeader']),
        Paragraph("<b>✓</b>", styles['TableHeader']),
    ]
    test_rows = [test_header]
    for t in tests:
        test_rows.append([
            p(t[0], 'TableCellCenter'),
            p(t[1], 'TableCell'),
            p(t[2], 'TableCell'),
            p(f'<font color="#00AA00"><b>{t[3]}</b></font>', 'TableCellCenter'),
        ])
    story.append(styled_table(test_rows, col_widths=[1*cm, 4.5*cm, W-6.5*cm, 1*cm]))

    story.append(Spacer(1, 0.4*cm))
    # Resumen
    res_data = [
        [Paragraph("<b>Métrica</b>", styles['TableHeader']),
         Paragraph("<b>Resultado</b>", styles['TableHeader'])],
        [p("Total inputs probados", 'TableCell'), p("<b>15</b>", 'TableCellCenter')],
        [p("Intención correcta", 'TableCell'), p("<b>15 / 15</b>", 'TableCellCenter')],
        [p("Dato literal correcto", 'TableCell'), p("<b>15 / 15</b>", 'TableCellCenter')],
        [p("Respuesta clara para negocio", 'TableCell'), p("<b>15 / 15</b>", 'TableCellCenter')],
        [p("Tasa de acierto técnico", 'TableCell'), Paragraph('<font color="#00AA00"><b>100%</b></font>', styles['TableCellCenter'])],
    ]
    story.append(styled_table(res_data, col_widths=[6*cm, W-6*cm]))

    # ─────────────────────────────────────
    # 10. CAPTURAS DE PANTALLA (EVIDENCIAS)
    # ─────────────────────────────────────
    story.append(PageBreak())
    story.append(p("10. Evidencias — Capturas de Pantalla", 'SectionTitle'))
    story.append(red_line())
    story.append(p(
        '<i>Apartado reservado para insertar las capturas de pantalla de la demo funcional. '
        'Cada evidencia debe mostrar el input del usuario y la respuesta del asistente.</i>'
    ))
    story.append(Spacer(1, 0.3*cm))

    # Generar 15 placeholders en grid de 2 columnas
    placeholders = []
    for i in range(1, 16):
        placeholders.append(photo_placeholder(f"Evidencia E-{i:02d}", width=7.5*cm, height=5*cm))

    # Crear grid de 2 columnas
    rows_of_photos = []
    for i in range(0, len(placeholders), 2):
        row = [placeholders[i]]
        if i + 1 < len(placeholders):
            row.append(placeholders[i + 1])
        else:
            row.append(Paragraph("", styles['BodyText2']))
        rows_of_photos.append(row)

    photo_grid = Table(rows_of_photos, colWidths=[W/2, W/2])
    photo_grid.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(photo_grid)

    # ─────────────────────────────────────
    # 11. ENDPOINTS API
    # ─────────────────────────────────────
    story.append(PageBreak())
    story.append(p("11. Endpoints de la API REST", 'SectionTitle'))
    story.append(red_line())

    api_data = [
        [Paragraph("<b>Método</b>", styles['TableHeader']),
         Paragraph("<b>Ruta</b>", styles['TableHeader']),
         Paragraph("<b>Descripción</b>", styles['TableHeader'])],
        [p("GET", 'TableCellCenter'), p("/api/health", 'TableCell'), p("Estado del servidor", 'TableCell')],
        [p("POST", 'TableCellCenter'), p("/api/chat", 'TableCell'), p("Enviar mensaje y recibir respuesta del asistente", 'TableCell')],
        [p("GET", 'TableCellCenter'), p("/api/proactive-alert", 'TableCell'), p("Alerta proactiva principal (recomendaciones automáticas)", 'TableCell')],
        [p("GET", 'TableCellCenter'), p("/api/sample-questions", 'TableCell'), p("Preguntas sugeridas para el usuario", 'TableCell')],
        [p("GET", 'TableCellCenter'), p("/api/merchants", 'TableCell'), p("Lista de comercios disponibles", 'TableCell')],
    ]
    story.append(styled_table(api_data, col_widths=[2*cm, 4*cm, W-6*cm]))

    # ─────────────────────────────────────
    # 12. ALERTAS PROACTIVAS
    # ─────────────────────────────────────
    story.append(p("12. Sistema de Alertas Proactivas", 'SectionTitle'))
    story.append(red_line())
    story.append(p("El asistente no solo responde; también <b>detecta automáticamente</b> problemas y oportunidades:"))
    story.append(bullet("Caída de ventas > 15% en la última semana"))
    story.append(bullet("Concentración > 30% en un solo cliente (riesgo de dependencia)"))
    story.append(bullet("Clientes frecuentes que no vuelven en 30+ días (churn)"))
    story.append(bullet("Sugerencia de promoción en días con menor tráfico"))

    # ─────────────────────────────────────
    # 13. POTENCIAL DE IMPLEMENTACIÓN
    # ─────────────────────────────────────
    story.append(p("13. Potencial de Implementación Real", 'SectionTitle'))
    story.append(red_line())
    story.append(p(
        "La arquitectura es <b>API-First y Stateless</b>. Al no depender de bases vectoriales ni estado "
        "pesado en servidor, la solución puede:"
    ))
    story.append(bullet("Desplegarse en un entorno contenerizado (<b>Docker / AWS ECS</b>) que escale horizontalmente"))
    story.append(bullet("Conectarse a la <b>API real de DeUna</b> modificando solo el archivo <i>data-loader.ts</i>"))
    story.append(bullet("Integrarse con <b>WhatsApp Business</b>, el canal más utilizado por micro-comerciantes en Ecuador"))
    story.append(bullet("Funcionar sin API key de LLM en modo offline (templates directos)"))

    # ─────────────────────────────────────
    # 14. CÓMO EJECUTAR LA DEMO
    # ─────────────────────────────────────
    story.append(p("14. Cómo Ejecutar la Demo", 'SectionTitle'))
    story.append(red_line())

    steps = [
        ("1.", "Clonar el repositorio e instalar dependencias:  npm install && cd server && npm install"),
        ("2.", "Copiar variables de entorno:  cp server/.env.example server/.env"),
        ("3.", "Configurar OpenAI (opcional):  Editar server/.env con LLM_PROVIDER=openai y OPENAI_API_KEY"),
        ("4.", "Levantar frontend + backend:  npm run dev"),
        ("5.", "Abrir en navegador:  http://localhost:4200"),
    ]
    for num, desc in steps:
        story.append(p(f"<b>{num}</b> {desc}"))

    # ─────────────────────────────────────
    # 15. LINK VIDEO DEMO
    # ─────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(p("15. Video Demo Funcional", 'SectionTitle'))
    story.append(red_line())

    video_box_data = [[
        Paragraph(
            '<font size="12" color="#1A1A2E"><b>🎬 Link al Video Demo Funcional</b></font><br/><br/>'
            '<font size="10" color="#999999"><i>[Insertar aquí el enlace al video de la demo en vivo]</i></font><br/><br/>'
            '<font size="9" color="#AAAAAA">Ejemplo: https://drive.google.com/file/d/xxx o https://youtu.be/xxx</font>',
            styles['BodyText2']
        )
    ]]
    video_box = Table(video_box_data, colWidths=[W])
    video_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), HexColor("#F5F7FA")),
        ('BOX', (0,0), (0,0), 2, ACCENT_BLUE),
        ('TOPPADDING', (0,0), (0,0), 20),
        ('BOTTOMPADDING', (0,0), (0,0), 20),
        ('LEFTPADDING', (0,0), (0,0), 20),
        ('RIGHTPADDING', (0,0), (0,0), 20),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('VALIGN', (0,0), (0,0), 'MIDDLE'),
    ]))
    story.append(video_box)

    # ─────────────────────────────────────
    # FOOTER / CIERRE
    # ─────────────────────────────────────
    story.append(Spacer(1, 1.5*cm))
    story.append(thin_line())
    story.append(p(
        '<font color="#999999">Equipo 4NOVA — Interact2Hack 2026 — DeUna · Mi Contador de Bolsillo</font>',
        'SmallNote'
    ))

    # ── BUILD ──
    doc.build(story)
    print(f"\n✅ PDF generado exitosamente: {OUTPUT_FILE}")
    print(f"   📄 Ubicación: {os.path.abspath(OUTPUT_FILE)}")


if __name__ == "__main__":
    build()
