/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function MaskPass( scene, camera ) {
    if (!(this instanceof MaskPass)) return new MaskPass(scene, camera);

    this.scene = scene;
    this.camera = camera;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

    this.inverse = false;
  };

  MaskPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

      var context = renderer.context;

      // don't update color or depth

      context.colorMask( false, false, false, false );
      context.depthMask( false );

      // set up stencil

      var writeValue, clearValue;

      if ( this.inverse ) {

        writeValue = 0;
        clearValue = 1;

      } else {

        writeValue = 1;
        clearValue = 0;

      }

      context.enable( context.STENCIL_TEST );
      context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
      context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
      context.clearStencil( clearValue );

      // draw into the stencil buffer

      renderer.setRenderTarget(readBuffer);
      if (this.clear) {
        renderer.clear();
      }
      renderer.render( this.scene, this.camera);

      renderer.setRenderTarget(writeBuffer);
      if (this.clear) {
        renderer.clear();
      }
      renderer.render( this.scene, this.camera);

      // re-enable update of color and depth

      context.colorMask( true, true, true, true );
      context.depthMask( true );

      // only render where stencil is set to 1

      context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
      context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

    }

  };

  return MaskPass
};
