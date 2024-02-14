export class SplitText {
  #options: {
    charClass: string;
    wordClass: string;
    lineClass: string;
    globalClass: string;
    emptySpaceName: string;
  };

  #rawChars: (HTMLElement | string)[];
  chars: HTMLElement[];
  #rawWords: (HTMLElement | string)[];
  words: HTMLElement[];
  lines: HTMLElement[];

  target: HTMLElement | null;
  textContent: string | null;

  constructor(elementOrSelector: string | HTMLElement) {
    this.#options = {
      charClass: "aki__char",
      wordClass: "aki__word",
      lineClass: "aki__line",
      globalClass: "aki_wrapper",
      emptySpaceName: "__AKI__EMPTY__SPACE__",
    };

    this.#rawChars = [];
    this.chars = [];
    this.#rawWords = [];
    this.words = [];
    this.lines = [];

    this.target = null;
    this.textContent = null;

    this.init(elementOrSelector);
  }

  #isElement(obj: any): obj is HTMLElement {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return (
        typeof obj === "object" &&
        obj.nodeType === 1 &&
        typeof obj.style === "object" &&
        typeof obj.ownerDocument === "object"
      );
    }
  }

  #createElement(
    tagname: string,
    content: string = "",
    htmlAttributes: Record<string, string> = {},
    ...cssClass: string[]
  ): HTMLElement {
    const __element__ = document.createElement(tagname);
    __element__.classList.add(...cssClass);
    __element__.innerHTML = content;

    for (const [key, value] of Object.entries(htmlAttributes)) {
      __element__.setAttribute(key, value);
    }

    return __element__;
  }

  #splitChars() {
    const textChars = `${this.textContent}`.split("");

    textChars.forEach((char) => {
      const charElement = this.#createElement(
        "div",
        `${char}`,
        {
          style: "position:relative; display:inline-block;",
        },
        `${this.#options.globalClass}`,
        `${this.#options.charClass}`
      );

      this.#rawChars.push(char === " " ? " " : charElement);
      this.chars.push(charElement as HTMLElement);
    });
    this.#rawChars.push(" ");
  }

  #splitWords() {
    let startIndex = 0;
    this.#rawChars.forEach((rawChar, index) => {
      if (rawChar === " ") {
        const wordArray = this.#rawChars
          .slice(startIndex, index)
          .filter((word) => word !== " ");

        const wordDiv = this.#createElement(
          "div",
          "",
          {
            style: "position:relative; display:inline-block;",
          },
          `${this.#options.globalClass}`,
          `${this.#options.wordClass}`
        );

        wordArray.forEach((word) => {
          wordDiv.append(word instanceof HTMLElement ? word : document.createTextNode(word));
        });

        this.words.push(wordDiv);
        this.#rawWords.push(wordDiv, " ");
        startIndex = index;
      }
    });
  }

  #splitLines() {
    let startIndex = 0;
    let lineArrays: HTMLElement[][] = [];

    const appendToLineArray = () => {
      lineArrays.forEach((lineArray) => {
        const lineDiv = this.#createElement(
          "div",
          "",
          {
            style: "position:relative; display:inline-block",
          },
          `${this.#options.globalClass}`,
          `${this.#options.lineClass}`
        );

        lineArray.forEach((lineWord) => {
          lineDiv.append(lineWord instanceof HTMLElement ? lineWord : document.createTextNode(lineWord));
          lineDiv.append(" ");
        });
        this.lines.push(lineDiv);
        if (this.target) this.target.append(lineDiv);
      });
    };

    this.words.reduce((oldOffsetTop: number | null, word: HTMLElement, index: number) => {
      const currentOffsetTop = word.offsetTop;

      if (
        (oldOffsetTop !== currentOffsetTop && oldOffsetTop !== null) ||
        index === this.words.length - 1
      ) {
        const computedIndex =
          index === this.words.length - 1 ? index + 1 : index;
        const lineArray = this.words.slice(startIndex, computedIndex);
        lineArrays.push(lineArray);
        startIndex = index;
      }

      return currentOffsetTop;
    }, null);

    appendToLineArray();
  }

  #combineAll() {
    this.words.forEach((word) => {
      if (this.target) this.target.append(word);
      if (this.target) this.target.append(" ");
    });
    this.#splitLines();
  }

  #splitStart() {
    this.#splitChars();
    this.#splitWords();
    this.#combineAll();
  }

  #getTextContent() {
    if (this.target) this.textContent = this.target.textContent ?? "";
  }

  #clearContent(element: HTMLElement) {
    element.innerHTML = "";
  }

  #logError(message: string) {
    console.error(`${message}`, "color:red", "color:inherit");
  }

  #logAndThrowError(message: string) {
    if (message.includes("%c")) {
      console.error(`${message}`, "color:red", "color:inherit");
    } else {
      console.error(`${message}`);
    }
    throw "SplitTextException! ⬆️";
  }

  init(elementOrSelector: string | HTMLElement) {
    if (this.#isElement(elementOrSelector)) {
      this.target = elementOrSelector;
      this.#getTextContent();
    } else {
      if (elementOrSelector !== "") {
        const element = document.querySelector<HTMLElement>(`${elementOrSelector}`);
        if (element) {
          this.target = element;
          this.#getTextContent();
          // window.addEventListener("resize", () => resizeFunction(element))
        } else {
          this.#logAndThrowError(
            `can't found %c${elementOrSelector}%c in DOM tree!`
          );
        }
      } else {
        this.#logAndThrowError(
          `selector is empty! %cplease give a valid%c selector!`
        );
      }
    }

    if (this.target) this.#clearContent(this.target);
    this.#splitStart();
  }
}
