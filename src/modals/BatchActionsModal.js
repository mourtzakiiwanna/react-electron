import React from 'react';
import { Modal } from '@mui/material';
import '../css/BatchActionsModal.css';
import '../css/Prototype.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
};

const BatchActionsModal = ({
                               handleRemoveAction,
                               handleSaveAllActions,
                               handleCloseModal,
                               handleShowModal,
                               handleRemoveAllActions,
                           }) => {
    const batchActions = JSON.parse(localStorage.getItem('batchActions')) || {};

    const groupedActions = batchActions.reduce((acc, action) => {
        const key = action.prototypePath || 'New Prototypes';
        acc[key] = acc[key] || {};
        acc[key][action.action] = acc[key][action.action] || [];
        acc[key][action.action].push(action);
        return acc;
    }, {});

    const removeAllActions = () => {
        localStorage.removeItem('batchActions');
        handleRemoveAllActions();
        handleCloseModal();
    };

    return (
        <Modal open={handleShowModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <div id="modal-container">
                <h3 className="modal-title">Batch Actions</h3>
                <hr />

                {Object.entries(groupedActions).map(([prototypePath, actions]) => (
                    <div key={prototypePath}>
                        <h3>{prototypePath}</h3>
                        {Object.entries(actions).map(([actionType, actionList]) => (
                            <div key={actionType}>
                                <h4>{actionType} action</h4>
                                <ul>
                                    {actionList.map((action, index) => (
                                        <li key={index}>
                                            {actionType === 'AddField' && (
                                                <>
                                                    <span className="label"> Field ID: </span> {action.id} <br />
                                                    <span className="label"> Field Type: </span> {action.type}<br />
                                                    <span className="label"> Field Constraint: </span> {action.constraint} <br />
                                                </>
                                            )}

                                            {actionType === 'UpdateField' && (
                                                <>
                                                    <span className="label">Field ID: </span> {action.id} <br />
                                                    <span className="label">Updated Field Type: </span> {action.type} <br />
                                                    <span className="label">Updated Constraint: </span> {action.constraint} <br />
                                                </>
                                            )}
                                            {actionType === 'DeleteField' && (
                                                <>
                                                    <span className="label"> Deleted Field ID: </span> {action.id} <br />
                                                </>
                                            )}
                                            {actionType === 'AddInheritance' && (
                                                <>
                                                    <span className="label"> Inherited: </span> {action.inheritedPrototypes} <br />
                                                </>
                                            )}
                                            {actionType === 'DeleteInheritance' && (
                                                <>
                                                    <span className="label"> Deleted Inherited: </span> {action.inherited} <br />
                                                </>
                                            )}
                                            {actionType === 'AddFieldGroup' && (
                                                <>
                                                    <span className="label"> Field Group: </span> {action.groupId} <br />
                                                </>
                                            )}
                                            {actionType === 'DeleteFieldGroup' && (
                                                <>
                                                    <span className="label"> Deleted Field Group: </span> {action.fieldGroup} <br />
                                                </>
                                            )}
                                            {actionType === 'CreatePrototype' && (
                                                <>
                                                <   span className="label"> Created Prototype: </span> {action.prototypeName} <br />
                                                </>
                                            )}
                                            {/* Add an "X" icon to remove the action */}
                                            {/*<span onClick={() => handleRemoveAction(action)}>X</span>*/}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <hr />

                    </div>
                ))}

                <div className="batch-button-container">
                    <button className="remove-all-button" onClick={removeAllActions}>
                        Remove all batch actions
                    </button>
                    <button className="batch-save-button" onClick={handleSaveAllActions}>
                        Save all actions
                    </button>
                    <button className="batch-close-button" onClick={handleCloseModal}>
                        X
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default BatchActionsModal;
