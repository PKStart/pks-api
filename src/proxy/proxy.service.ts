import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { BirthdayItem, KoreanDictItem } from 'pks-common'

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  public async getBirthdays(url: string): Promise<BirthdayItem[]> {
    const res = await this.httpService.get<string>(url).toPromise()
    const lines = res.data.split(/\r\n/)
    return lines.map(line => {
      const entry = line.split(/\t/)
      return {
        name: entry[0],
        date: entry[1],
      }
    })
  }

  public async getKoreanWordList(url: string): Promise<KoreanDictItem[]> {
    const res = await this.httpService.get<string>(url).toPromise()
    const lines = res.data.split(/\r\n/)
    return lines.map(line => {
      const entry = line.split(/\t/)
      return {
        kor: entry[0],
        hun: entry[1],
      }
    })
  }
}
