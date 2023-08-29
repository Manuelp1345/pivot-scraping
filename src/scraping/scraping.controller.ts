import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { CreateScrapingDto } from './dto/create-scraping.dto';

@Controller('scraping/product')
export class ScrapingProductController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post()
  fetchProductNameAndPrice(@Body() createScrapingDto: CreateScrapingDto) {
    return this.scrapingService.fetchProductNameAndPrice(createScrapingDto);
  }
}

@Controller('scraping/desc')
export class ScrapingProductDescController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post()
  fetchProductNameAndPrice(@Body() createScrapingDto: CreateScrapingDto) {
    return this.scrapingService.fetchProductDesc(createScrapingDto);
  }
}
