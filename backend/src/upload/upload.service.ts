import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Uploads dizini yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const uniqName = `${Date.now()}-${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, uniqName);

    // Dosyayı kaydet
    fs.writeFileSync(filePath, file.buffer);

    // URL'i döndür
    return `/uploads/${uniqName}`;
  }

  async uploadPdf(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', 'pdfs');
    
    // Uploads/pdfs dizini yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const uniqName = `${Date.now()}-${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, uniqName);

    // Dosyayı kaydet
    fs.writeFileSync(filePath, file.buffer);

    // URL'i döndür
    return `/uploads/pdfs/${uniqName}`;
  }
} 