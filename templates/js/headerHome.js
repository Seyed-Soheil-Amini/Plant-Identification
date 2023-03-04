class OtherHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        



  `;

  }
}

customElements.define("other-header", OtherHeader);
