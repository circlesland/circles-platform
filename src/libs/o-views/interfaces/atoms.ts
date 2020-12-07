export interface Avataaar {
  data: {
    seed: string;
  };
  design: {
    radius: number;
  };
}

export interface Button {
  data: {
    label: string;
  };
  design: {
    type: string;
    disabled?: boolean;
  };
}

export interface ButtonIcon {
  design: {
    icon: any;
    type: string;
    disabled?: boolean;
  };
};

export interface CategoryTitle {
  data: {
    label: string;
  };
}

export interface NavItem {
  data: {
    label: string;
  };
  design: {
    icon: any;
  };
}

export interface OverflowAction {
  data: {
    label: string;
  };
  design: {
    type: string;
  };
}