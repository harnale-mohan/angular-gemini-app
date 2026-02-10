import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { environment } from 'src/environments/environment';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss']
})
export class GoogleComponent {
  searchForm !: NgForm
  answerText: string = ''

  public geminiAi = new GoogleGenerativeAI(environment.geminiApiKey)
  public model = this.geminiAi.getGenerativeModel({ model: 'gemini-2.5-flash' })



  generateText(question: string): Observable<string> {
    if (!question || !question.trim()) {
      return of('Please enter a valid question.');
    }
    return from(this.model.generateContent(question))
                                                  .pipe(
                                                      map(result => result.response.text())
                                                    )
  }

  onQuestion(text: string) {
    this.generateText(text).subscribe({
      next: result => {
        this.answerText = result;
      },
      error: () => {
        this.answerText = 'Something went wrong';
      }
    });
  }
}



