import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../languages/entities/language.entity';

@Injectable()
export class LanguagesSeeder {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async seed() {
    console.log('🌱 Starting languages seeding...');

    // 60 farklı dil
    const languages = [
      // İlk 30 dil
      { name: 'Türkçe', code: 'tr' },
      { name: 'İngilizce', code: 'en' },
      { name: 'Arapça', code: 'ar' },
      { name: 'Farsça', code: 'fa' },
      { name: 'Urduca', code: 'ur' },
      { name: 'Almanca', code: 'de' },
      { name: 'Fransızca', code: 'fr' },
      { name: 'İspanyolca', code: 'es' },
      { name: 'İtalyanca', code: 'it' },
      { name: 'Rusça', code: 'ru' },
      { name: 'Çince', code: 'zh' },
      { name: 'Japonca', code: 'ja' },
      { name: 'Korece', code: 'ko' },
      { name: 'Hollandaca', code: 'nl' },
      { name: 'Portekizce', code: 'pt' },
      { name: 'İsveççe', code: 'sv' },
      { name: 'Norveççe', code: 'no' },
      { name: 'Danca', code: 'da' },
      { name: 'Fince', code: 'fi' },
      { name: 'Yunanca', code: 'el' },
      { name: 'İbranice', code: 'he' },
      { name: 'Hintçe', code: 'hi' },
      { name: 'Bengalce', code: 'bn' },
      { name: 'Tamilce', code: 'ta' },
      { name: 'Tayca', code: 'th' },
      { name: 'Vietnamca', code: 'vi' },
      { name: 'Endonezyaca', code: 'id' },
      { name: 'Malayca', code: 'ms' },
      { name: 'Tagalog', code: 'tl' },
      { name: 'Swahili', code: 'sw' },
      
      // 30 yeni dil
      { name: 'Kazakça', code: 'kk' },
      { name: 'Özbekçe', code: 'uz' },
      { name: 'Kırgızca', code: 'ky' },
      { name: 'Türkmence', code: 'tk' },
      { name: 'Azerbaycan Türkçesi', code: 'az' },
      { name: 'Tatarca', code: 'tt' },
      { name: 'Başkurtça', code: 'ba' },
      { name: 'Çuvaşça', code: 'cv' },
      { name: 'Yakutça', code: 'sah' },
      { name: 'Buryatça', code: 'bua' },
      { name: 'Kalmıkça', code: 'xal' },
      { name: 'Tuva Türkçesi', code: 'tyv' },
      { name: 'Hakasça', code: 'kjh' },
      { name: 'Altayca', code: 'alt' },
      { name: 'Şorca', code: 'cjs' },
      { name: 'Dolganca', code: 'dlg' },
      { name: 'Tofalarca', code: 'kim' },
      { name: 'Gagavuzca', code: 'gag' },
      { name: 'Karaimce', code: 'kdr' },
      { name: 'Çuvaşça', code: 'cv' },
      { name: 'Kırım Tatar Türkçesi', code: 'crh' },
      { name: 'Karaçay-Balkarca', code: 'krc' },
      { name: 'Kumukça', code: 'kum' },
      { name: 'Nogayca', code: 'nog' },
      { name: 'Karakalpakça', code: 'kaa' },
      { name: 'Çağatay Türkçesi', code: 'chg' },
      { name: 'Osmanlı Türkçesi', code: 'ota' },
      { name: 'Eski Türkçe', code: 'otk' },
      { name: 'Uygur Türkçesi', code: 'ug' },
      { name: 'Salarca', code: 'slr' },
      
      // Resimdeki eksik diller
      { name: 'Peştuca', code: 'ps' },
      { name: 'Hausa', code: 'ha' },
      { name: 'Igbo', code: 'ig' },
      { name: 'Yoruba', code: 'yo' },
      { name: 'Luganda', code: 'lg' },
      { name: 'Rohingya', code: 'rhg' },
      { name: 'Katalanca', code: 'ca' }
    ];

    for (const languageData of languages) {
      try {
        // Dilin zaten var olup olmadığını kontrol et
        const existingLanguage = await this.languageRepository.findOne({
          where: [
            { name: languageData.name },
            { code: languageData.code }
          ]
        });

        if (existingLanguage) {
          console.log(`⚠️  Language already exists: ${languageData.name} (${languageData.code})`);
          continue;
        }

        // Dili oluştur
        const language = this.languageRepository.create({
          ...languageData,
          isActive: true
        });

        await this.languageRepository.save(language);
        console.log(`✅ Added language: ${languageData.name} (${languageData.code})`);

      } catch (error) {
        console.error(`❌ Error adding language ${languageData.name}:`, error.message);
      }
    }

    console.log('🎉 Languages seeding completed!');
  }
}
