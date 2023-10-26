/**
 * Image Tool for the Editor.js
 *
 * @author Pawritharya <kaunghtetkyaw02749@gmail.com>
 * @license MIT
 * @see {@link https://github.com/Kaung-HtetKyaw/editorjs-clutch-widget-embed}
 *
 * To developers.
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.js — main Tool's interface, public API and methods for working with data
 *  2) ui.js — module for UI manipulations: render, showing preloader, etc
 */

/**
 * @typedef {object} ClutchWidgetToolData
 * @description Image Tool's input and output data format
 * @property {string} iframe — html string
 * @property {script} script - html string
 */

import './index.css';

import Ui from './ui';

/**
 * @typedef {object} ClutchWidgetConfig
 * @description Config supported by Tool
 *
 * @property {RegExp} pattern - regex pattern to match your pasted html
 */
export default class ClutchWidgetTool {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * @param {object} tool - tool properties got from editor.js
   * @param {ClutchWidgetToolData} tool.data - previously saved data
   * @param {ClutchWidgetConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   * @param {boolean} tool.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Tool's initial config
     */
    this.config = {
      pattern: config.pattern,
    };

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      readOnly,
    });

    /**
     * Set saved state
     */
    this._data = {};
    this.data = data;

    // initialize widget when ready
    this.ui.initWidget();
  }

  /**
   * do something when widget is removed
   *
   *@param {string} url - file url that is about to be deleted
   * @returns {void}
   */
  async removed() {}

  /**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this.ui.render(this.data);
  }

  /**
   * Validate data: check if script exists
   *
   * @param {ImageToolData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    return savedData.script;
  }

  /**
   * Return Block data
   *
   * @public
   *
   * @returns {ClutchWidgetData}
   */
  save() {
    return this.data;
  }

  /**
   * Returns configuration for block tunes: add background, add border, stretch image
   *
   * @public
   *
   * @returns {Array}
   */
  renderSettings() {
    return [];
  }

  /**
   * Specify paste substitutes
   *
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @returns {{tags: string[], patterns: object<string, RegExp>, files: {extensions: string[], mimeTypes: string[]}}}
   */
  static get pasteConfig() {
    return {
      /**
       * Paste <script src type ></script><div data-[*]></div> into the Editor
       */
      patterns: {
        script:
          /<script\b(?=[^>]*\ssrc=['"][^'"]*['"])(?=[^>]*\stype=['"]text\/javascript['"])[^>]*>.*?<\/script>\s*<div[^>]*data-[^>]*>.*<\/div>/g,
      },
    };
  }

  /**
   * Specify paste handlers
   *
   * @public
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param {CustomEvent} event - editor.js custom paste event
   * {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   * @returns {void}
   */
  async onPaste(event) {
    switch (event.type) {
      case 'pattern': {
        this.script = event.detail.data;
        break;
      }
    }
  }

  /**
   * Private methods
   * ̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿
   */

  /**
   * Stores all Tool's data
   *
   * @private
   *
   * @param {ClutchWidgetData} data - data in Image Tool format
   */
  set data(data) {
    this.script = data.script;
  }

  /**
   * Set new script
   *
   * @private
   *
   * @param {string} script - pasted script string
   */
  set script(script) {
    this._data.script = script;
    this.ui.renderIframe(this.data);
    if (this.ui.iframe) {
      this._data.iframe = this.ui.iframe.innerHTML;
    }
  }

  /**
   * Return Tool data
   *
   * @private
   *
   * @returns {ClutchWidgetData}
   */
  get data() {
    return this._data;
  }
}
