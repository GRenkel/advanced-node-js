const fs = require("fs/promises");

(async () => {

    const createFile = async (path) => {

        let existingFileHandle;

        try {
            existingFileHandle = await fs.open(path, 'r')
            existingFileHandle.close()

            return console.log(`The file ${path} already exists`)

        } catch (error) {

            const newFileHandle = await fs.open(path, 'w')
            console.log(`The file ${path} was sucessfully created.`)
            newFileHandle.close()
        }
    }

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path)
            console.log(`The file ${path} was sucessfully deleted.`)
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log(`The file ${path} doesnt exist.`)
            } else {
                console.log(`An error occurred while removing the file: `, error)
            }

        }
    }


    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath)
            console.log(`The file ${path} was sucessfully renamed.`)
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log(`The file ${path} doesnt exist.`)
            } else {
                console.log(`An error occurred while removing the file: `, error)
            }

        }
    }

    const addToFile = async (path, content) => {
        try {
            //with w will replace everything
            // const newFileHandle = fs.open(path, 'w')
            const newFileHandle = await fs.open(path, 'a')
            const contentBuffer = Buffer.from(content)
            await newFileHandle.write(contentBuffer)
            console.log(`The file ${path} was sucessfully written.`)
        } catch (error) {
            console.log(`The file ${path} doesnt exist.`)
        }
    }
    // commands
    const CREATE_FILE = "create file"
    const DELETE_FILE = "delete file"
    const RENAME_FILE = "rename file"
    const ADD_TO_FILE = "add to file"



    const commandFileHandler = await fs.open("./command.txt", "r")
    const watcher = fs.watch('./command.txt')

    commandFileHandler.on("change", async () => {
        //get the size of our file
        const fileMeta = await commandFileHandler.stat();
        const size = fileMeta.size
        //allocate our buffer with the size of the file
        const readBuff = Buffer.alloc(size)
        //the location at which we want to start filling our buffer
        const offset = 0
        //how many bytes we want to read
        const length = readBuff.byteLength;
        //the position that we want to start reading the file from
        const position = 0

        //we always want to read the whole content
        await commandFileHandler.read(
            readBuff,
            offset,
            length,
            position
        );
        //decoder => 0100111 => meaningful
        //encoder => meaningful => 0100111
        const command = readBuff.toString('utf-8')

        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1)
            createFile(filePath)
        }

        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1)
            deleteFile(filePath)
        }

        if (command.includes(RENAME_FILE)) {
            const DELIMITATOR = " to "
            const _idx = command.indexOf(DELIMITATOR) //starting index  of delimitator
            const oldFilePath = command.substring(DELETE_FILE.length + 1, _idx)
            const newFilePath = command.substring(_idx + DELIMITATOR.length)

            renameFile(oldFilePath, newFilePath)
        }

        if (command.includes(ADD_TO_FILE)) {
            const DELIMITATOR = " this content: "
            const _idx = command.indexOf(DELIMITATOR)
            const content = command.substring(_idx + DELIMITATOR.length)
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx)
            addToFile(filePath, content)
        }

    })

    for await (const event of watcher) {
        if (event.eventType == "change") {

            commandFileHandler.emit("change")
            console.log("All FileHandler are also EventEmitters")

        }
    }
})()  