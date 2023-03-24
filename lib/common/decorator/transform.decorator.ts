interface ITextInput {
  value?: string;
}

export const TransformTrim = ({ value }: ITextInput) => {
  return value && value.trim();
};

export const TransformUppercaseFirstCharacter = ({ value }: ITextInput) => {
  return value && value[0].toUpperCase() + value.slice(1);
};

export const TransformLowerCase = ({ value }: ITextInput) => {
  return value && value.toLowerCase();
};

export const TransformVietnamesePhoneNumber = ({ value }: ITextInput) => {
  return value && `+84${value.slice(1)}`;
};
