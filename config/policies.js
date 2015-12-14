module.exports = {
  FootprintController: {
    create: [ 'FootprintPolicy.create' ],
    createWithId: [ 'FootprintPolicy.createWithId' ],
    find: [ 'FootprintPolicy.find' ],
    update: [ 'FootprintPolicy.update' ],
    destroy: [ 'FootprintPolicy.destroy' ],
    createAssociation: [ 'FootprintPolicy.createAssociation' ],
    createAssociationWithId: [ 'FootprintPolicy.createAssociationWithId' ],
    findAssociation: [ 'FootprintPolicy.findAssociation' ],
    updateAssociation: [ 'FootprintPolicy.updateAssociation' ],
    destroyAssociation: [ 'FootprintPolicy.destroyAssociation' ]
  }
}
