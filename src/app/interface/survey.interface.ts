export interface ISurvey {
    id?:string;
    date?:string;
    name?:string;
    questions?:Array<IQuestion>;
}

export interface IQuestion {
    id?:string;
    question?:string;
    answers?:Array<IAnswer>;
}

export interface IAnswer {
    id?:string;
    answer?:string;
}