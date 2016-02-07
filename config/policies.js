module.exports = {
  FootprintController: {
    create: [ 'FootprintPolicy.create' ],
    find: [ 'FootprintPolicy.find' ],
    update: [ 'FootprintPolicy.update' ],
    destroy: [ 'FootprintPolicy.destroy' ],
    createAssociation: [ 'FootprintPolicy.createAssociation' ],
    findAssociation: [ 'FootprintPolicy.findAssociation' ],
    updateAssociation: [ 'FootprintPolicy.updateAssociation' ],
    destroyAssociation: [ 'FootprintPolicy.destroyAssociation' ]
  }
}
