/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE, EffectComposer) {
  function ShaderPass( shader, textureID ) {
    if (!(this instanceof ShaderPass)) return new ShaderPass(shader, textureID);

    this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader

    } );

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;

  };

  ShaderPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

      if ( this.uniforms[ this.textureID ] ) {

        this.uniforms[ this.textureID ].value = readBuffer.texture;

      }

      EffectComposer.quad.material = this.material;

      if ( this.renderToScreen ) {

        renderer.setRenderTarget( null );
        renderer.render( EffectComposer.scene, EffectComposer.camera );

      } else {

        renderer.setRenderTarget( writeBuffer );
        if ( this.clear )
            renderer.clear();

        renderer.render( EffectComposer.scene, EffectComposer.camera );

      }

    }

  };

  return ShaderPass;

};
