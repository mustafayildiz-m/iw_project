#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DeepL API ile tüm çeviri dosyalarını çevirir
Kullanım: python3 translate_all.py
"""

import json
import os
import urllib.request
import urllib.parse
import time
from datetime import datetime

# DeepL API bilgileri
DEEPL_API_KEY = "b80f08d3-407a-4af5-981b-6075c1efda10:fx"
DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

# Dil kodlarını DeepL formatına çevir
def map_language_code(lang_code):
    lang_map = {
        'tr': 'TR', 'en': 'EN', 'ar': 'AR', 'de': 'DE', 'fr': 'FR',
        'es': 'ES', 'it': 'IT', 'ru': 'RU', 'zh': 'ZH', 'ja': 'JA',
        'ko': 'KO', 'pt': 'PT', 'nl': 'NL', 'pl': 'PL', 'sv': 'SV',
        'da': 'DA', 'fi': 'FI', 'el': 'EL', 'he': 'HE', 'hi': 'HI',
        'bn': 'BN', 'ta': 'TA', 'th': 'TH', 'vi': 'VI', 'id': 'ID',
        'ms': 'MS', 'fa': 'FA', 'ur': 'UR', 'cs': 'CS', 'sk': 'SK',
        'uk': 'UK', 'bg': 'BG', 'hr': 'HR', 'ro': 'RO', 'hu': 'HU',
        'et': 'ET', 'lv': 'LV', 'lt': 'LT', 'sl': 'SL', 'mt': 'MT',
        'ku': 'EN', 'mk': 'MK', 'hy': 'EN', 'mr': 'HI', 'te': 'HI',
        'gu': 'HI', 'ml': 'HI', 'kn': 'HI', 'or': 'HI', 'sr': 'SR'
    }
    return lang_map.get(lang_code.lower(), lang_code.upper())

# DeepL API ile çeviri yap
def translate_text(text, target_lang, source_lang='EN', retries=3):
    if not text or not text.strip():
        return text
    
    target_lang_mapped = map_language_code(target_lang)
    
    for attempt in range(retries):
        try:
            if attempt > 0:
                delay = min(1000 * (2 ** (attempt - 1)), 5000) / 1000
                time.sleep(delay)
            
            params = urllib.parse.urlencode({
                'text': text,
                'target_lang': target_lang_mapped,
                'source_lang': source_lang
            }).encode('utf-8')
            
            req = urllib.request.Request(
                DEEPL_API_URL,
                data=params,
                headers={
                    'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    if data.get('translations') and len(data['translations']) > 0:
                        return data['translations'][0]['text']
                elif response.status == 429:
                    if attempt < retries - 1:
                        print(f"    ⚠️  Rate limit, 10 saniye bekleniyor...")
                        time.sleep(10)
                        continue
                else:
                    if attempt < retries - 1:
                        continue
                    return text
        except urllib.error.HTTPError as e:
            if e.code == 429:
                if attempt < retries - 1:
                    print(f"    ⚠️  Rate limit (HTTP {e.code}), 10 saniye bekleniyor...")
                    time.sleep(10)
                    continue
            if attempt < retries - 1:
                continue
            return text
        except Exception as e:
            if attempt < retries - 1:
                continue
            print(f"    ⚠️  Çeviri hatası: {str(e)[:100]}")
            return text
    
    return text

# JSON dosyasını optimize şekilde çevir
def translate_file_section(data, target_lang, section_name, translated_count=[0]):
    if isinstance(data, dict):
        translated = {}
        for key, value in data.items():
            if isinstance(value, dict):
                translated[key] = translate_file_section(value, target_lang, f"{section_name}.{key}", translated_count)
            elif isinstance(value, list):
                translated[key] = [translate_file_section(item, target_lang, f"{section_name}.{key}", translated_count) if isinstance(item, (dict, str)) else item for item in value]
            elif isinstance(value, str) and value.strip():
                translated_count[0] += 1
                if translated_count[0] % 50 == 0:
                    print(f"    📊 {translated_count[0]} çeviri tamamlandı...")
                translated[key] = translate_text(value, target_lang)
                time.sleep(0.1)  # Rate limiting için bekleme
            else:
                translated[key] = value
        return translated
    elif isinstance(data, str) and data.strip():
        translated_count[0] += 1
        return translate_text(data, target_lang)
    else:
        return data

def main():
    # Script'in bulunduğu dizine geç
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("=" * 80)
    print("DEEPL API İLE TÜM ÇEVİRİLERİ HAZIRLAMA")
    print("=" * 80)
    print(f"Çalışma dizini: {script_dir}")
    print(f"Başlangıç zamanı: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API URL: {DEEPL_API_URL}")
    print(f"API Key: {DEEPL_API_KEY[:20]}...")
    print("\n⚠️  NOT: Bu işlem uzun sürecek!")
    print("⚠️  Her dosya için yüzlerce çeviri yapılacak")
    print("⚠️  Rate limiting nedeniyle her çeviri arasında bekleme yapılacak")
    print("\nBaşlatılıyor...\n")

    # İngilizce kaynak dosyasını oku
    en_json_path = os.path.join(script_dir, 'en.json')
    if not os.path.exists(en_json_path):
        print(f"❌ HATA: en.json dosyası bulunamadı: {en_json_path}")
        return
    
    with open(en_json_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    welcome_en = en_data.get('common', {}).get('welcome', 'Welcome')

    # Yeni eklenen dosyalar
    new_files = {
        'zh.json': 'zh', 'hi.json': 'hi', 'es.json': 'es', 'pt.json': 'pt',
        'ru.json': 'ru', 'it.json': 'it', 'ko.json': 'ko', 'uk.json': 'uk',
        'ku.json': 'ku', 'ro.json': 'ro', 'bg.json': 'bg', 'sr.json': 'sr',
        'hu.json': 'hu', 'cs.json': 'cs', 'pl.json': 'pl', 'sk.json': 'sk',
        'sl.json': 'sl', 'mk.json': 'mk', 'hy.json': 'hy', 'mr.json': 'mr',
        'te.json': 'te', 'gu.json': 'gu', 'ml.json': 'ml', 'kn.json': 'kn',
        'or.json': 'or'
    }

    total_files = len(new_files)
    current_file = 0
    start_time = time.time()

    for filename, lang_code in new_files.items():
        current_file += 1
        file_start_time = time.time()
        print(f"\n[{current_file}/{total_files}] {filename} ({lang_code}) çevriliyor...")
        
        if not os.path.exists(filename):
            print(f"  ⚠️  Dosya bulunamadı: {filename}")
            continue
        
        try:
            # Dosyayı oku
            with open(filename, 'r', encoding='utf-8') as f:
                file_data = json.load(f)
            
            # Zaten çevrilmiş mi kontrol et
            welcome_translated = file_data.get('common', {}).get('welcome', '')
            if welcome_translated != 'Welcome' and welcome_translated and welcome_translated != welcome_en:
                print(f"  ⏭️  {filename} zaten çevrilmiş, atlanıyor...")
                continue
            
            # Çeviri sayacı
            translated_count = [0]
            
            # Tüm dosyayı çevir (books.languages hariç)
            print("  🔄 Çeviri başlatılıyor...")
            translated_data = {}
            
            for section_key, section_value in file_data.items():
                if section_key == 'books' and isinstance(section_value, dict):
                    # books bölümü - languages hariç çevir
                    translated_books = {}
                    for book_key, book_value in section_value.items():
                        if book_key == 'languages':
                            translated_books[book_key] = book_value
                        else:
                            print(f"  📝 Çevriliyor: books.{book_key}")
                            translated_books[book_key] = translate_file_section(
                                book_value, lang_code, f'books.{book_key}', translated_count
                            )
                    translated_data[section_key] = translated_books
                else:
                    print(f"  📝 Çevriliyor: {section_key}")
                    translated_data[section_key] = translate_file_section(
                        section_value, lang_code, section_key, translated_count
                    )
            
            # Dosyayı kaydet
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(translated_data, f, ensure_ascii=False, indent=2)
            
            file_elapsed = time.time() - file_start_time
            print(f"  ✅ {filename} çevrildi ve kaydedildi")
            print(f"     📊 {translated_count[0]} çeviri, ⏱️  {file_elapsed:.1f} saniye ({file_elapsed/60:.1f} dakika)")
            
            # Genel ilerleme
            elapsed = time.time() - start_time
            avg_time = elapsed / current_file
            remaining = avg_time * (total_files - current_file)
            print(f"     ⏱️  Toplam: {elapsed/60:.1f} dk, Kalan: ~{remaining/60:.1f} dk")
            
        except Exception as e:
            print(f"  ❌ Hata: {str(e)[:200]}")
            import traceback
            traceback.print_exc()
            continue

    total_elapsed = time.time() - start_time
    print("\n" + "=" * 80)
    print("✅ TÜM ÇEVİRİLER TAMAMLANDI!")
    print(f"⏱️  Toplam süre: {total_elapsed/60:.1f} dakika")
    print(f"Bitiş zamanı: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)

if __name__ == '__main__':
    main()

