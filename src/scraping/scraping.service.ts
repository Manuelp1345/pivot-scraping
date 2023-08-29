import { Injectable } from '@nestjs/common';
import { CreateScrapingDto } from './dto/create-scraping.dto';
import OpenAI from 'openai';
import axios from 'axios';
import cheerio from 'cheerio';

const gptQuest = async (messages) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo-16k',
  });
  return chatCompletion.choices;
};

@Injectable()
export class ScrapingService {
  async fetchProductNameAndPrice(createScrapingDto: CreateScrapingDto) {
    const { url } = createScrapingDto;
    const response = await axios.get(url);

    if (response.status === 200) {
      const html = response.data;
      //count the number of characters in the html

      const $ = cheerio.load(html);

      //remove input tags
      $('input').remove();
      //remove form
      $('form').remove();
      //remove header
      $('header').remove();
      //remove nav
      $('nav').remove();
      //remove footer
      $('footer').remove();

      // remove all the scripts from the html
      $('script').remove();

      // delete all the comments from the html
      $('*')
        .contents()
        .each(function () {
          if (this.nodeType === 8) {
            $(this).remove();
          }
        });

      const elements = `Product: ${$("[class*='product']")
        .first()
        .text()}  \t ${$('h1').first().text()} \n Prices: ${$(
        "[class*='price']",
      ).html()} \t ${$("[class*='price']").last().html()} `;

      const lines = elements.split(/[\n]/);
      const datosFiltrados = lines.filter((objeto) => objeto.trim() !== '');
      const messages = [
        {
          role: 'user',
          content: `From the following html, provide, product name and price ($) on JSON example { productName: '', price:''}:`,
        },
      ];
      for (let i = 0; i < datosFiltrados.length; i++) {
        const line = datosFiltrados[i];
        //if line is empty, skip
        if (line.length === 0) {
          continue;
        }
        messages.push({
          role: 'user',
          content: line,
        });
      }

      console.log(messages);

      const responseGPT = await gptQuest(messages);
      // return res.send(messages);

      return responseGPT[0].message.content;
    } else {
      console.log(
        'Failed to retrieve the webpage. Status code:',
        response.status,
      );
    }
  }
  async fetchProductDesc(createScrapingDto: CreateScrapingDto) {
    const { url } = createScrapingDto;
    const response = await axios.get(url);

    if (response.status === 200) {
      const html = response.data;
      //count the number of characters in the html

      const $ = cheerio.load(html);

      //remove input tags
      $('input').remove();
      //remove form
      $('form').remove();
      //remove header
      $('header').remove();
      //remove nav
      $('nav').remove();
      //remove footer
      $('footer').remove();

      // remove all the scripts from the html
      $('script').remove();

      // delete all the comments from the html
      $('*')
        .contents()
        .each(function () {
          if (this.nodeType === 8) {
            $(this).remove();
          }
        });

      const images = [];
      $('img').each((i, el) => {
        images.push(`${$(el).attr('alt')}: ${$(el).attr('src')} \t`);
      });

      console.log(images);

      const elements = `Product: ${$("[class*='product']")
        .first()
        .text()}  \t ${$(
        "[class*='description']",
      ).html()} \n image: ${images} \n rating: ${$(
        "[class*='rating']",
      ).text()}   `;

      const lines = elements.split(/[\n]/);
      const datosFiltrados = lines.filter((objeto) => objeto.trim() !== '');
      const messages = [
        {
          role: 'user',
          content: `In the following HTML, provide the product description, product image, and the total rating (optional) and average rating (optional) in the JSON example { productDescription: '', ProductImage:'', totalRating:'' | undefined, AverageRating:'' | undefine }:`,
        },
      ];
      for (let i = 0; i < datosFiltrados.length; i++) {
        const line = datosFiltrados[i];
        //if line is empty, skip
        if (line.length === 0) {
          continue;
        }
        messages.push({
          role: 'user',
          content: line,
        });
      }

      console.log(messages);

      const responseGPT = await gptQuest(messages);
      // return res.send(messages);

      return JSON.parse(responseGPT[0].message.content);
    } else {
      console.log(
        'Failed to retrieve the webpage. Status code:',
        response.status,
      );
    }
  }
}
