export class QuestionHandler {
  constructor(next) {
    this.next = next;
  }

  async handle(email, answers, firebase) {
    throw new Error("handle() must be implemented in a subclass");
  }
}

export class FirstQuestionHandler extends QuestionHandler {
  async handle(email, answers, firebase) {
    console.log("First question handler:", { answer: answers[0] });
    const valid = await firebase.validateAnswer(
      email,
      "securityAnswer1",
      answers[0]
    );
    if (!valid) {
      console.log("First question incorrect");
      return false;
    }
    return this.next
      ? this.next.handle(email, answers.slice(1), firebase)
      : true;
  }
}

export class SecondQuestionHandler extends QuestionHandler {
  async handle(email, answers, firebase) {
    console.log("Second question handler:", { answer: answers[0] });
    const valid = await firebase.validateAnswer(
      email,
      "securityAnswer2",
      answers[0]
    );
    if (!valid) {
      console.log("Second question incorrect");
      return false;
    }
    return this.next
      ? this.next.handle(email, answers.slice(1), firebase)
      : true;
  }
}

export class ThirdQuestionHandler extends QuestionHandler {
  async handle(email, answers, firebase) {
    console.log("Third question handler:", { answer: answers[0] });
    const valid = await firebase.validateAnswer(
      email,
      "securityAnswer3",
      answers[0]
    );
    if (!valid) {
      console.log("Third question incorrect");
      return false;
    }
    return true;
  }
}
