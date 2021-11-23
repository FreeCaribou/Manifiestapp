import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get(
      'http://testwordpress.gerardweb.eu/wp-json/wp/v2/posts?_fields=title,content,categories,author,tags,_links,%20_embedded,id&_embed=wp:featuredmedia,wp:term'
    ).subscribe(data => {
      console.log('data', data)
    })
  }

}
