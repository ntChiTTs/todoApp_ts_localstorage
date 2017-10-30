enum STATUS {
  ACTIVE,
  COMPLETED,
  DELETED
}

class Todo {
  title: string;
  status: STATUS;

  constructor(title: string, status: STATUS) {
    this.title = title;
    this.status = status;
  }
}

var todos: Todo [] = [];
