import { Component, OnInit, Input } from '@angular/core';
import { ISurvey, IAnswer, IQuestion } from './interface/survey.interface';
import { SurveyService } from './service/survey.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
    
    surveyDialog: boolean;
    survey: ISurvey;
    surveys: ISurvey[];
    selectedSurveys: ISurvey[];
    submitted: boolean;
    stringRef = String;
    viewMode: boolean;

    constructor(private surveyService: SurveyService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.surveyService.getSurveys().subscribe(result => {
            console.log(result);
            this.surveys = result;
        });
    }

    openNew() {
        this.survey = {};
        this.submitted = false;
        this.surveyDialog = true;
    }

    deleteSelectedSurveys() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected surveys?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveys = this.surveys.filter(val => !this.selectedSurveys.includes(val));
                this.selectedSurveys = null;
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Surveys Deleted', life: 3000});
            }
        });
    }

    editSurvey(survey: ISurvey) {
        console.log(survey);
        this.survey = {...survey};
        this.surveyDialog = true;
    }

    viewSurvey(survey: ISurvey) {
        console.log(survey);
        this.viewMode = true;
        this.survey = {...survey};
        this.surveyDialog = true;
    }

    deleteSurvey(survey: ISurvey) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this Survey?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveys = this.surveys.filter(val => val.id !== survey.id);
                this.survey = {};
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Survey Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.surveyDialog = false;
        this.submitted = false;
        this.viewMode = false;
    }
    
    saveSurvey() {
        this.submitted = true;

        if (this.survey.id) {
            this.surveys[this.findIndexById(this.survey.id)] = this.survey;                
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Survey Updated', life: 3000});
        }
        else {
            if(!this.survey.questions || this.survey.questions.length === 0) return;
            this.survey.id = (this.surveys.length + 1).toString();
            this.survey.date = new Date().toJSON().slice(0,10).split('-').reverse().join('/');
            this.surveys.push(this.survey);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Survey Created', life: 3000});
        }

        this.surveys = [...this.surveys];
        this.surveyDialog = false;
        this.survey = {};
    }

    findIndexById(id: string): number {
        for (let i = 0; i < this.surveys.length; i++) {
            if (this.surveys[i].id === id) {
                return i;
            }
        }
    }

    addQuestion(){
        if (this.survey.questions) {
            if(this.survey.questions.length === 4) {
                return;
            }
            let id = (this.survey.questions.length + 1).toString();
            this.survey.questions.push({"id": id, "question": "", "answers": [{"id": "1", "answer": ""}]});
        }
        else {
            let previousName = this.survey.name;
            this.survey = {"date": "", "name": "", "questions": []};
            this.survey.date = new Date().toJSON().slice(0,10).split('-').reverse().join('/');
            this.survey.name = previousName || null;
            this.survey.questions.splice(0,4);
            let id = (this.survey.questions.length + 1).toString();
            this.survey.questions.push({"id": id, "question": "", "answers": [{"id": "1", "answer": ""}]});
        }
    }

    deleteQuestion(question: IQuestion) {
        if(this.survey.questions.length === 1) {
            return;
        }
        this.survey.questions = this.survey.questions.filter(val => val.id !== question.id);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Question Deleted', life: 1000});
    }

    addAnswer(question: IQuestion){
        if (question.answers) {
            if(question.answers.length === 4) {
                return;
            }
            let id = (question.answers.length + 1).toString();
            question.answers.push({"id": id, "answer": ""});
        }
        else {
            question.answers.push({"id": "1", "answer": ""});
        }
    }

    deleteAnswer(question: IQuestion, answer: IAnswer) {

        if(question.answers.length === 1) {
            return;
        }

        question.answers = question.answers.filter(val => val.id !== answer.id); 
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Answer Deleted', life: 1000});
    }
}
