import QtQuick 2.4
import QtQuick.Dialogs 1.2
import QtQuick.Layouts 1.1
import QtQuick.Controls 1.3

Dialog {
    id: mainWindow
    width: 300
    height: 300
    title: "Add Task"
    standardButtons: StandardButton.Save | StandardButton.Cancel
    onAccepted: {
        destroy()
    }
    onRejected: {
        destroy()
    }

    GridLayout {
        flow: GridLayout.TopToBottom
        Row {
            Text {
                text: "Subject: "
            }
            Rectangle {
                width: 200
                height: 30
                color: "#FFF"
                border.color: "#272822"
                border.width: 1
                radius: 2
                antialiasing: true

                TextInput {
                    width: 280
                    height: 28
                    cursorVisible: true
                    selectByMouse: true
                }
            }
        }
        Row {
            Text {
                text: "Title: "
            }
            Rectangle {
                width: 200
                height: 30
                color: "#FFF"
                border.color: "#272822"
                border.width: 1
                radius: 2
                antialiasing: true

                TextInput {
                    width: 280
                    height: 28
                    cursorVisible: true
                    selectByMouse: true
                }
            }
        }
        Row {
            Text {
                text: "Due Date: "
            }
            Rectangle {
                width: 200
                height: 30
                color: "#FFF"
                border.color: "#272822"
                border.width: 1
                radius: 2
                antialiasing: true

                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        Qt.createComponent("datePicker.qml").createObject(mainWindow, {}).open();
                    }
                }
            }
        }
        Row {
            Text {
                text: "Completed: "
            }
            Rectangle {
                width: 200
                height: 30
                color: "#FFF"
                border.color: "#272822"
                border.width: 1
                radius: 2
                antialiasing: true

                TextInput {
                    width: 280
                    height: 28
                    cursorVisible: true
                    selectByMouse: true
                }
            }
        }
    }
}
