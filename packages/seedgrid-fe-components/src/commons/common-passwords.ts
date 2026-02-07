const BASE_COMMON_PASSWORDS = [
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",
  "111111",
  "222222",
  "333333",
  "444444",
  "555555",
  "666666",
  "777777",
  "888888",
  "999999",
  "000000",
  "password",
  "password1",
  "password12",
  "password123",
  "senha",
  "senha1",
  "senha12",
  "senha123",
  "senha1234",
  "admin",
  "admin1",
  "admin123",
  "qwerty",
  "qwerty1",
  "qwerty123",
  "abc123",
  "abc12345",
  "abcdef",
  "abcdefg",
  "abcdefg1",
  "abcdefg123",
  "letmein",
  "welcome",
  "iloveyou",
  "love",
  "football",
  "monkey",
  "dragon",
  "master",
  "sunshine",
  "princess",
  "baseball",
  "passw0rd",
  "p@ssword",
  "pa55word",
  "qazwsx",
  "qazwsx123",
  "asdfgh",
  "asdfgh123",
  "zxcvbn",
  "zxcvbn123",
  "login",
  "user",
  "root",
  "teste",
  "test",
  "test123",
  "teste123",
  "123123",
  "123123123",
  "321321",
  "654321",
  "987654",
  "112233",
  "121212",
  "00000000",
  "aaaaaa",
  "aaaaaaa",
  "aaaaaaaa",
  "bbbbbb",
  "cccccc",
  "dddddd",
  "eeeeee",
  "fffffff",
  "gggggg",
  "hhhhhh",
  "iiiiii",
  "jjjjjj",
  "kkkkkk",
  "llllll",
  "mmmmmm",
  "nnnnnn",
  "oooooo",
  "pppppp",
  "qqqqqq",
  "rrrrrr",
  "ssssss",
  "tttttt",
  "uuuuuu",
  "vvvvvv",
  "wwwwww",
  "xxxxxx",
  "yyyyyy",
  "zzzzzz",
  "secret",
  "senha2020",
  "senha2021",
  "senha2022",
  "senha2023",
  "senha2024",
  "password2020",
  "password2021",
  "password2022",
  "password2023",
  "password2024",
  "admin2020",
  "admin2021",
  "admin2022",
  "admin2023",
  "admin2024",
  "qwerty2020",
  "qwerty2021",
  "qwerty2022",
  "qwerty2023",
  "qwerty2024"
];

const PREFIXES = [
  "senha",
  "password",
  "admin",
  "qwerty",
  "abc",
  "teste",
  "test",
  "user",
  "login",
  "welcome",
  "love",
  "iloveyou",
  "football",
  "master",
  "monkey",
  "dragon",
  "sunshine",
  "princess",
  "pass",
  "secret",
  "root",
  "letmein"
];

const SUFFIX_NUMBERS = Array.from({ length: 40 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 56 }, (_, index) => String(1970 + index));

export function buildCommonPasswordSet(extra?: string[]) {
  const list: string[] = [];
  const add = (value: string) => {
    if (value) list.push(value);
  };

  BASE_COMMON_PASSWORDS.forEach(add);

  PREFIXES.forEach((prefix) => {
    SUFFIX_NUMBERS.forEach((num) => add(`${prefix}${num}`));
    YEARS.forEach((year) => add(`${prefix}${year}`));
  });

  ["123", "1234", "12345", "123456", "1234567", "12345678", "123456789"].forEach((seq) => add(seq));
  ["1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"].forEach((seq) => add(seq));

  if (extra && extra.length > 0) {
    extra.forEach((value) => add(value));
  }

  const normalized = Array.from(
    new Set(list.map((item) => item.trim().toLowerCase()).filter(Boolean))
  );

  return new Set(normalized.slice(0, 1000));
}
