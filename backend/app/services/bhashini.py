"""Digital India NLTM Bhashini Service.

Integrates Automated Speech Recognition (ASR / STT) and Text-to-Speech (TTS)
for coastal Indian languages (Malayalam, Tamil, Telugu, Hindi, Bengali, etc.)
via the Bhashini Dhruva Pipeline API (National Language Translation Mission, MeitY).
"""
import base64
import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger("navika_ai.bhashini")

# Standard ISO-639-1 / Bhashini language code mapping
BHASHINI_LANG_MAP = {
    "ml": "ml",  # Malayalam
    "ta": "ta",  # Tamil
    "te": "te",  # Telugu
    "hi": "hi",  # Hindi
    "bn": "bn",  # Bengali
    "en": "en",  # Indian English
    "kn": "kn",  # Kannada
    "gu": "gu",  # Gujarati
    "mr": "mr",  # Marathi
    "or": "or",  # Odia
}

class BhashiniService:
    def __init__(self):
        self.api_key = settings.BHASHINI_API_KEY
        self.user_id = settings.BHASHINI_USER_ID
        self.pipeline_id = settings.BHASHINI_PIPELINE_ID
        self.endpoint = settings.BHASHINI_INFERENCE_URL
        self.timeout = 10.0

    async def transcribe_audio(
        self,
        audio_base64: str,
        language: str = "ml"
    ) -> Dict[str, Any]:
        """Performs Automated Speech Recognition (STT) on audio payload.
        
        Args:
            audio_base64: Raw audio encoded in base64 (wav/webm/flac).
            language: Target regional maritime language (ml, ta, te, hi, bn, en).
        Returns:
            Dict containing transcription text, detected language, and provider status.
        """
        target_lang = BHASHINI_LANG_MAP.get(language.lower(), "hi")
        
        # If API key is not configured, return an informative fallback response in requested language
        if not self.api_key:
            logger.info("Bhashini API Key not set. Using local speech pipeline simulation.")
            simulated_queries = {
                "hi": "सुरक्षित समुद्री मार्ग और निकटतम मत्स्य पालन क्षेत्र दिखाएं",
                "ml": "സുരക്ഷിത പാതയും ഏറ്റവും അടുത്ത മത്സ്യബന്ധന മേഖലയും കാണിക്കുക",
                "ta": "பாதுகாப்பான கடல் பாதை மற்றும் அருகிலுள்ள மீன்பிடி மண்டலத்தைக் காட்டுங்கள்",
                "te": "సురక్షిత సముద్ర మార్గం మరియు సమీప చేపల వేట ప్రాంతాన్ని చూపించు",
                "bn": "নিরাপদ সমুদ্র রুট এবং নিকটতম মাছ ধরার অঞ্চল দেখান",
                "en": "Show safe nautical route and nearest potential fishing zone"
            }
            return {
                "success": True,
                "text": simulated_queries.get(target_lang, simulated_queries.get("en", "Show safe route")),
                "language": target_lang,
                "source": "simulated_local",
                "message": "Bhashini API key not configured. Dispatched simulated maritime speech transcription."
            }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "Ulca-Api-Key": self.api_key
        }
        if self.user_id:
            headers["userID"] = self.user_id

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {
                            "sourceLanguage": target_lang
                        },
                        "audioFormat": "wav",
                        "samplingRate": 16000
                    }
                }
            ],
            "inputData": {
                "audio": [
                    {
                        "audioContent": audio_base64
                    }
                ]
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(self.endpoint, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    # Parse Bhashini pipeline response format
                    pipeline_response = data.get("pipelineResponse", [])
                    if pipeline_response:
                        output = pipeline_response[0].get("output", [])
                        if output and "source" in output[0]:
                            transcribed_text = output[0]["source"]
                            return {
                                "success": True,
                                "text": transcribed_text,
                                "language": target_lang,
                                "source": "bhashini_cloud"
                            }
                logger.warning(f"Bhashini ASR returned HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.error(f"Error calling Bhashini ASR API: {e}")

        return {
            "success": False,
            "text": "",
            "language": target_lang,
            "error": "Failed to transcribe audio via Bhashini."
        }

    async def synthesize_speech(
        self,
        text: str,
        language: str = "ml",
        gender: str = "female"
    ) -> Dict[str, Any]:
        """Performs Text-to-Speech (TTS) for maritime advice.
        
        Args:
            text: Nautical guidance or safety alert text to synthesize.
            language: Regional language code (ml, ta, te, hi, bn, en).
            gender: Voice gender preference ('female' or 'male').
        Returns:
            Dict containing base64 audio content, MIME type, and language.
        """
        target_lang = BHASHINI_LANG_MAP.get(language.lower(), "ml")

        if not self.api_key:
            logger.info("Bhashini API Key not set. Providing client-side speech synthesis directive.")
            return {
                "success": True,
                "audio_base64": None,
                "text": text,
                "language": target_lang,
                "source": "client_fallback",
                "message": "Bhashini key unset; client Web Speech API recommended for offline voice playback."
            }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "Ulca-Api-Key": self.api_key
        }
        if self.user_id:
            headers["userID"] = self.user_id

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {
                            "sourceLanguage": target_lang
                        },
                        "gender": gender
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": text
                    }
                ]
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(self.endpoint, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    pipeline_response = data.get("pipelineResponse", [])
                    if pipeline_response:
                        audio_list = pipeline_response[0].get("audio", [])
                        if audio_list and "audioContent" in audio_list[0]:
                            audio_b64 = audio_list[0]["audioContent"]
                            return {
                                "success": True,
                                "audio_base64": audio_b64,
                                "format": "audio/wav",
                                "language": target_lang,
                                "source": "bhashini_cloud"
                            }
                logger.warning(f"Bhashini TTS returned HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.error(f"Error calling Bhashini TTS API: {e}")

        return {
            "success": False,
            "audio_base64": None,
            "text": text,
            "language": target_lang,
            "error": "Failed to synthesize speech via Bhashini."
        }

bhashini_service = BhashiniService()
