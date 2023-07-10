export function createComponent(componentElement: HTMLElement) {
  const tmpInput = componentElement.querySelector<HTMLTemplateElement>("template.app-tmp-input");

  if(tmpInput === null){
    throw new Error(`Cannot find input template`);
  }

  const inputsList = tmpInput.parentElement;

  if(inputsList === null){
    throw new Error(`Cannot find list container`);
  }

  const updateResult = () => {
    const children = [...inputsList.children].filter(
      (elem) => elem !== tmpInput
    );

    const result = children.reduce(
      (carry, element) =>
        carry +
        (element.querySelector<HTMLInputElement>
        ('input[type="number"].app-cmp-input')?.valueAsNumber ?? 0),
      0
    );

    [...componentElement.querySelectorAll<HTMLOutputElement>("output.app-cmp-result")].forEach(
      (elem) => (elem.value = `${result.toLocaleString()}`)
    );
  };

  const updateList = () => {
    updateResult();

    const children = [...inputsList.children].filter(
      (elem) => elem !== tmpInput
    );

    children.forEach((element, i) => {
      [...element.querySelectorAll(".app-cmp-input-no")].forEach(
        (elem) => (elem.textContent = `${i + 1}`)
      );
    });

    [...inputsList.querySelectorAll<HTMLElement & {disabled: boolean}>(".app-cmd-remove-input")].forEach(
      (elem) => (elem.disabled = children.length === 1)
    );
  };

  const createElement = () => {
    const container = (tmpInput.content.cloneNode(true) as DocumentFragment).firstElementChild;

    if(container === null){
      throw new Error(`Cannot find template container`);
    }

    container.addEventListener("click", (e) => {
      if ((e.target as Element | null)?.matches?.(".app-cmd-remove-input")) {
        container.remove();

        updateList();
      }
    });

    inputsList.append(container);
    updateList();
  };

  componentElement.addEventListener("click", (e) => {
    if ((e.target as Element | null)?.matches?.(".app-cmd-add-input")) {
      createElement();
    }
  });

  inputsList.addEventListener("change", (e) => {
    if ((e.target as Element | null)?.matches?.('input[type="number"].app-cmp-input')) {
      updateResult();
    }
  });

  createElement();
}

export function createSection(sectionElement : HTMLElement) {
  const tmpSection = sectionElement.querySelector<HTMLTemplateElement>("template.app-tmp-section");
  
  if(tmpSection === null){
    throw new Error(`Cannot find input section`);
  }
  
  const sectionsList = tmpSection.parentElement;

  if(sectionsList === null){
    throw new Error(`Cannot find sections list`);
  }

  const updateList = () => { 
    const children = [...sectionsList.children].filter(
      (elem) => elem != tmpSection
    );

    children.forEach((element, i) => {
      [...element.querySelectorAll(".app-cmp-section-no")].forEach(
        (elem) => (elem.textContent = `${i + 1}`)
      );
    });

    [...sectionsList.querySelectorAll<HTMLElement & {disabled: boolean}>(".app-cmd-remove-section")].forEach(
      (elem) => (elem.disabled = children.length === 1)
    );
  };

  const createSection = () => {
    const container = (tmpSection.content.cloneNode(true) as DocumentFragment).firstElementChild;

    if(container === null){
      throw new Error(`Cannot find template container`);
    }

    container.addEventListener("click", (e) => {
      if ((e.target as Element | null)?.matches?.(".app-cmd-remove-section")) {
        container.remove();

        updateList();
      }
    });

    sectionsList.append(container);

    createComponent(container as HTMLElement);
    updateList();
  };

  sectionElement.addEventListener("click", (e) => {
    if ((e.target as Element | null)?.matches?.(".app-cmd-add-section")) {
      createSection();
    }
  });

  createSection();
}
