from langchain_ollama import OllamaEmbeddings


def embeddings():
    embeddings=OllamaEmbeddings(model="nomic-embed-text")        
    return embeddings