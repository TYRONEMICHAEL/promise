export enum PromisorState {
  active,
  inactive,
}

export const toPromisorState = (state: any) => {
  if (state["active"] != null) {
    return PromisorState.active;
  } else {
    return PromisorState.inactive;
  }
};

export const fromPromisorState = (state: PromisorState) => {
  switch (state) {
    case PromisorState.active:
      return { active: {} };
    case PromisorState.inactive:
      return { inActive: {} };
  }
};
