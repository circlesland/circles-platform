export interface ProfileItem {
  data: {
    image: string;
    title: string;
    subtitle: string;
    description?: string;
  };
}

export interface Announcement {
  data: {
    text: string;
    button: string;
  };
  action: {
    link: string;
  };
}

export interface DappIcon {
  data: {
    title: string;
    tag?: string | Promise<string>;
  };
  design: {
    type: string;
    icon: any;
  };
  action: {
    route: string;
  };
}


export interface Header {
  data: {
    title: string;
  };
}


export interface KeyItem {
  data: {
    image: string;
    title: string;
    subtitle: string;
    privatekey: string;
    seedphrase?: string;
  };
}

export interface ProfileHeader {
  data: {
    subtitle: string;
    image?: string;
  };
}

export interface ProfileField {
  data: {
    title: string;
    subtitle: string;
  };
}

export interface TokenItem {
  data: {
    image: string;
    title: string;
    subtitle: string;
    balance: number;
    description: string;
  };
}
