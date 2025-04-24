import re
import yt_dlp
from datetime import datetime
from youtube_transcript_api import YouTubeTranscriptApi
from keybert import KeyBERT

def extrair_video_id(url: str) -> str:
    patterns = [
        r"youtu\.be/([a-zA-Z0-9_-]{11})",
        r"youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})",
        r"youtube\.com/embed/([a-zA-Z0-9_-]{11})"
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return url if re.match(r"^[a-zA-Z0-9_-]{11}$", url) else None

def obter_legenda(video_id: str) -> str:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["pt", "pt-BR", "en"])
        return " ".join([linha["text"] for linha in transcript])
    except:
        return ""

def gerar_keywords(texto: str, qtd: int = 10):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(texto, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=qtd)
    return [kw for kw, _ in keywords]

def obter_dados_video(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            "titulo": info.get("title"),
            "descricao": info.get("description", "").split("\n")[0],
            "data": info.get("upload_date"),
            "tags": info.get("tags", [])
        }

def gerar_markdown(video_id: str, autor: str = "jix") -> str:
    info = obter_dados_video(video_id)

    if not info:
        return "❌ Vídeo não encontrado."

    titulo = info["titulo"]
    descricao = info["descricao"]
    data = datetime.strptime(info["data"], "%Y%m%d").date()
    embed_url = f"https://www.youtube.com/embed/{video_id}"

    tags = info["tags"]
    legenda = obter_legenda(video_id)
    if not tags:
        tags = gerar_keywords(legenda or descricao)

    keywords_md = "\n  - " + "\n  - ".join(tags[:10]) if tags else "aqw"

    markdown = f"""---
authors:
  - {autor}
date: {data}
keywords:{keywords_md}
description: {descricao}
social_share: true
--- 
# {titulo}

Texto que ficará aparecendo na página principal do blog antes do leia.

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="{embed_url}" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  ></iframe>
</div>

??? tip "Transcrição"
    {legenda if legenda else "Legenda indisponível para este vídeo."}

## Visão Geral

Em construção.

## Método de Obtenção

Em construção.

## Status

Em construção.

## Combo

Em construção.

## Encantamentos

Em construção.

## Consumíveis

Em construção.

## Referências Bibliográficas
Vozes da minha cabeça.
"""
    return markdown

if __name__ == "__main__":
    url = input("Cole a URL do vídeo do YouTube: ").strip()
    video_id = extrair_video_id(url)
    
    if not video_id:
        print("❌ URL inválida ou vídeo não reconhecido.")
    else:
        markdown = gerar_markdown(video_id)
        filename = f"{video_id}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(markdown)
        print(f"✅ Markdown gerado com sucesso: {filename}")
