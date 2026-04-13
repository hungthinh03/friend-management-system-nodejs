/**
 * Block.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      blocker: { model: 'user' },  // người chặn
      blocked: { model: 'user' }   // người bị chặn
    },

};

