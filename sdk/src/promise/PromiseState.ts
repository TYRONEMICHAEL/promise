export enum PromiseState {
  created,
  active,
  completed,
  voided,
}

export const toPromiseState = (state: any) => {
  if (state["created"] != null) {
    return PromiseState.created;
  } else if (state["active"] != null) {
    return PromiseState.active;
  } else if (state["completed"] != null) {
    return PromiseState.completed;
  } else {
    return PromiseState.voided;
  }
};

export const fromPromiseState = (state: PromiseState) => {
  switch (state) {
    case PromiseState.created:
      return { created: {} };
    case PromiseState.active:
      return { active: {} };
    case PromiseState.completed:
      return { completed: {} };
    case PromiseState.voided:
      return { voided: {} };
  }
};
