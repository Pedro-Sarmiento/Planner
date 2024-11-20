from langchain.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_ollama import OllamaLLM as Ollama
from RAG.embeddings import embeddings

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Se te proporciona un contexto con información relevante sobre actividades y planes disponibles. Utiliza exclusivamente la información de este contexto para responder a la consulta. No inventes planes ni detalles adicionales; responde solo si el contexto contiene un plan específico que responde a la consulta.

{context}

---
Ten en cuenta que el usuario se encuentra en esta localización: {location}.
Si puedes responder a la consulta con un plan del contexto, responde en formato JSON con la siguiente estructura:

[
    {{
        "titulo": "Título del plan",
        "descripcion": "Descripción detallada del plan, destacando los puntos de interés o qué lo hace especial.",
        "ubicacion": "Lugar exacto o áreas recomendadas (por ejemplo, 'Roque Nublo, Gran Canaria').",
        "presupuesto_estimado": "Rango de presupuesto (por ejemplo, 'Económico', 'Moderado', 'Alto') o cantidad exacta si es posible.",
        "tiempo_requerido": "Duración estimada de la actividad (por ejemplo, 'Menos de 2 horas', 'Medio día', 'Todo el día').",
        "temporada_recomendada": "Época del año recomendada para realizar la actividad (por ejemplo, 'Primavera', 'Verano', 'Todo el año').",
        "tipo_actividad": "Categoría del plan (por ejemplo, 'Deportes', 'Naturaleza', 'Cultura', 'Gastronomía').",
        "publico_objetivo": "Tipo de personas a quienes puede interesar (por ejemplo, 'Familias', 'Aventureros', 'Amantes de la fotografía')."
    }}
]

Si no tienes ninguna recomendación exacta en el contexto para esta consulta, responde exclusivamente con el mensaje y no añadas nada mas:
"No tengo recomendaciones para esta consulta en base al contexto proporcionado." 

Consulta: {question}
"""



def query_rag(query_text: str, location: str):
    print(f"Location: {location}")
    embedding_function = embeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text, location=location)
    model = Ollama(model="llama3.2")
    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id", None) for doc, _score in results]
    formatted_response = f"Response: {response_text}"
    return response_text