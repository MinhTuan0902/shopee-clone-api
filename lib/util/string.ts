/**
 *
 * @param text Text to transform
 * @returns A slugs string
 */
export function transformTextToSlugs(text: string): string {
  const from =
    'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
  const to =
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (var i = 0; i < from.length; i++) {
    text = text.replace(RegExp(from[i], 'gi'), to[i]);
  }

  text = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-');

  return text;
}
