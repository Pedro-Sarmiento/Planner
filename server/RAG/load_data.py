import argparse
import os
import shutil
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma

from embeddings import embeddings
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import DirectoryLoader

CHROMA_PATH = "chroma"
DATA_PATH = "input/"


def main():
    #clear_database()
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)
    
    

def load_documents():
    text_loader_kwargs={'autodetect_encoding': True}
    loader = DirectoryLoader("./RAG/input/", glob="./*.txt", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
    documents = loader.load()
    return documents
    
def split_documents(documents: list[Document]):
    chunks = []
    for document in documents:
        # Dividimos el contenido del documento en secciones utilizando el delimitador específico.
        plans = document.page_content.split("----")
        
        # Cada plan se convierte en un "chunk" Document individual.
        for plan in plans:
            # Eliminamos espacios en blanco al inicio y al final
            plan = plan.strip()
            if plan:  # Asegurarnos de que el plan no esté vacío
                chunk = Document(page_content=plan, metadata=document.metadata)
                chunks.append(chunk)
    return chunks



def add_to_chroma(chunks: list[Document]):
    # Load the existing database.
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=embeddings()
    )

    # Calculate Page IDs.
    chunks_with_ids = calculate_chunk_ids(chunks)

    # Add or Update the documents.
    existing_items = db.get(include=[])  # IDs are always included by default
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    # Only add documents that don't exist in the DB.
    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
        print("✅ Added new documents")
    else:
        print("✅ No new documents to add")

def calculate_chunk_ids(chunks):

    # This will create IDs like "data/monopoly.pdf:6:2"
    # Page Source : Page Number : Chunk Index

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        # Add it to the page meta-data.
        chunk.metadata["id"] = chunk_id

    return chunks


def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        
if __name__ == "__main__":
    main()

