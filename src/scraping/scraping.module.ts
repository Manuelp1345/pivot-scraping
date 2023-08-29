import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import {
  ScrapingProductController,
  ScrapingProductDescController,
} from './scraping.controller';

@Module({
  controllers: [ScrapingProductController, ScrapingProductDescController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
