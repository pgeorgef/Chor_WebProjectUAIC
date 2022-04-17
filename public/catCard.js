customElements.define('catCard',
class extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('catCard');
        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode : 'open'});
        shadowRoot.appendChild(templateContent.cloneNode(true))
    }
})