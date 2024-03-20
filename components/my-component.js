class MyComponent extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });

        // Define the HTML content of your component
        this.shadowRoot.innerHTML = `
            <style>
                width: 100vw;
                height: 100vw;

                .odaviewer {
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    margin: auto;
                    position: fixed;
                  }
            </style>
            <div id="content">
                <h1>Hello, World!</h1>
            </div>
        `;
    }

    connectedCallback() {
        // This method is called when the element is connected to the DOM
        const shadowRoot = this.shadowRoot;
        console.log(shadowRoot); // Log the shadow root to the console
        // You can now safely work with the shadow root here
    }

    // Add lifecycle callbacks or custom methods as needed
}

// Define your custom element
customElements.define('my-component', MyComponent);