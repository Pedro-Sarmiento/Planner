import speech_recognition as sr
import os
from dotenv import load_dotenv

from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)

def audio_recorder(timeout=3):
    while True:
        filename = "audio.wav"
        with sr.Microphone() as source:
            rec = sr.Recognizer()
            rec.adjust_for_ambient_noise(source, duration=1)
            rec.pause_threshold = 2

            try:
                print("Say something!")

                audio = rec.listen(source, timeout=timeout)
                print("Recorded")
            except sr.WaitTimeoutError:
                print("Timeout")
                return "ERROR: Try again"  
            with open(filename, "wb") as f:
                f.write(audio.get_wav_data())
            break
    return "Completed recording!"




def speech2text(l):
    load_dotenv()

    AUDIO_FILE = "audio.wav"

    API_KEY = os.getenv("DG_API_KEY")

    try:
        deepgram = DeepgramClient(API_KEY)

        with open(AUDIO_FILE, "rb") as file:
            buffer_data = file.read()

        payload: FileSource = {
            "buffer": buffer_data,
        }

        options = PrerecordedOptions(
            model="nova-2",
            smart_format=True,
            language=l,
        )

        response = deepgram.listen.prerecorded.v("1").transcribe_file(payload, options)

        transcript = response['results']['channels'][0]['alternatives'][0]['transcript']

        return transcript

    except Exception as e:
        print(f"Error: {e}")
        return str(e)