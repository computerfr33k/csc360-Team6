import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

ApplicationWindow {
    title: qsTr("OnTrack")
    width: 640
    height: 480
    visible: true
    id: mainWindow

    menuBar: MenuBar {
        Menu {
            title: qsTr("&File")
            MenuItem {
                text: qsTr("&Add Task")
            }
            MenuItem {
                text: qsTr("&Delete Task")
            }
            MenuItem {
                text: qsTr("E&xit")
                onTriggered: Qt.quit()
            }
        }
        Menu {
            title: qsTr("&Reminders")
            MenuItem {
                text: qsTr("&Create")
                onTriggered: {
                    Qt.createComponent("createReminder.qml").createObject(
                                mainWindow, {

                                }).open()
                }
            }
        }
    }
    ListModel {
        id: taskModel
        ListElement {
            subject: "CSC 360"
            title: "Team Project #2"
            due: "05/08/2015"
            completed: "No"
        }
        ListElement {
            subject: "CSC 333"
            title: "AES Version 1"
            due: "05/07/2015"
            completed: "No"
        }
    }

    Item {
        anchors.fill: parent
        property alias button3: button3
        property alias button2: button2
        property alias button1: button1

        GridLayout {
            id: gridLayout1
            anchors.rightMargin: 10
            anchors.leftMargin: 10
            anchors.topMargin: 10
            anchors.bottomMargin: 10
            anchors.fill: parent
            z: -3
            flow: GridLayout.TopToBottom

            TableView {
                Layout.fillHeight: true
                Layout.fillWidth: true
                anchors.left: parent.left
                id: taskView
                model: taskModel
                sortIndicatorVisible: true
                width: parent.width / 2

                TableViewColumn {
                    role: "subject"
                    title: "Subject"
                }
                TableViewColumn {
                    role: "title"
                    title: "Title"
                }

                TableViewColumn {
                    role: "due"
                    title: "Due Date"
                }
                TableViewColumn {
                    role: "completed"
                    title: "Completed"
                }
            }
            RowLayout {
                anchors.bottom: gridLayout1.bottom
                anchors.horizontalCenter: gridLayout1.horizontalCenter
                Button {
                    id: button1
                    text: qsTr("Add Task")
                    onClicked: {
                        Qt.createComponent("addTask.qml").createObject(
                                    mainWindow, {

                                    }).open()
                    }
                }

                Button {
                    id: button2
                    text: qsTr("Delete Task")
                }

                Button {
                    id: button3
                    text: qsTr("Edit Task")
                    onClicked: {
                        Qt.createComponent("editTask.qml").createObject(
                                    mainWindow, {

                                    }).open()
                    }
                }
            }
        }
    }
}
