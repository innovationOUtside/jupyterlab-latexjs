import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
const {
  parse,
  HtmlGenerator
} = require('latex.js') as any;
import { Widget } from '@lumino/widgets';

var generator = new HtmlGenerator({ hyphenate: false });
document.head.appendChild(generator.stylesAndScripts(''));

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'text/latex';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-tex';

/**
 * A widget for rendering tex.
 */
export class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render tex into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as string;

    generator = parse(data, { generator: generator });
    this.node.innerHTML = '';
    // Append the LaTeX.js DOM fragment
    this.node.appendChild(generator.domFragment());

    return Promise.resolve();
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for tex data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new OutputWidget(options)
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'jupyterlab-latexjs:plugin',
  // description: 'Adds MIME type renderer for tex content',
  rendererFactory,
  rank: 100,
  dataType: 'string',
  fileTypes: [
    {
      name: 'tex',
      mimeTypes: [MIME_TYPE],
      extensions: ['tex']
    }
  ],
  documentWidgetFactoryOptions: {
    name: 'JupyterLab Latex.js',
    primaryFileType: 'tex',
    fileTypes: ['tex'],
    defaultFor: ['tex']
  }
};

export default extension;
