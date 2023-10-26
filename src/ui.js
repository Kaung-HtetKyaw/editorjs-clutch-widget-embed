import { make } from './utils/dom';

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - initializing iframe widget
 */
export default class Ui {
  /**
   * @param {object} ui - image tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {ClutchWidgetConfig} ui.config - user config
   * @param {boolean} ui.readOnly - read-only mode flag
   */
  constructor({ api, config, readOnly }) {
    this.api = api;
    this.config = config;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
    };

    /**
     * Create base structure
     *  <wrapper>
     *    <div>
     *      <iframe></iframe>
     *    </div>
     *  </wrapper>
     */
    // inject script
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: 'clutch-widget-wrapper',
      iframe: 'clutch-widget',
    };
  }

  /**
   * Renders tool UI
   *
   * @param {ImageToolData} toolData - saved tool data
   * @returns {Element}
   */
  render(toolData) {
    if (toolData.iframe) {
      this.nodes.wrapper.insertAdjacentHTML('afterend', toolData.iframe);
    }
    this.initWidget();

    return this.nodes.wrapper;
  }

  /**
   * rendered iframe content
   *
   * @returns {Element | null}
   */
  get iframe() {
    return document.querySelector(`.${this.CSS.iframe}`);
  }

  /**
   *
   * @param {string} html
   * @returns {Element}
   */
  createIframeMarkup(html) {
    const div = make('div');

    div.innerHTML = html;

    return div;
  }

  /**
   * Renders execute script to render iframe widget
   *
   * @param {ImageToolData} toolData - saved tool data
   * @returns {void}
   */
  renderIframe(toolData) {
    if (toolData.script) {
      this.nodes.wrapper.appendChild(this.createIframeMarkup(toolData.script));
    }

    // execute script to render iframe
    this.initWidget();
  }

  /**
   * initialize the clutch co widget
   */
  initWidget() {
    if (window.CLUTCHCO) {
      window.CLUTCHCO.Init();
    }
  }
}
