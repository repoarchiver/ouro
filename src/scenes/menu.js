import BaseScene from './baseScene'

export default class Menu extends BaseScene {
  constructor() {
    super('menu')
  }

  get colors() {
    return [
      '#DF1A2D',
      '#0798BB',
      '#F8E71C',
      '#7ED321',
    ]
  }

  get text() {
    return {
      menuTitle: 'Ouro',
      player1: 'Player 1',
      player2: 'Player 2',
      chooseColor: 'Choose Colour:',
      controls: 'Controls',
      gameInstructionsHeader: 'Game Instructions',
      instructions: [
        '- Player score + 1 when opponent fails to return ball',
        '- Player loses when snake touches a wall',
      ],
      gamePrompt: '[Hit Enter]'
    }
  }

  addMenuTitle() {
    this.add.text(
      this.middleX,
      20,
      this.text.menuTitle,
      { fill: '#0F0' },
    ).setOrigin(0.5, 0)
  }

  get colorBoxSize() {
    return 20
  }

  get colorBoxSpacing() {
    return 8
  }

  createColorBoxes(offset) {
    const colorBoxes = this.colors
      .map(this.hexStringToColor)
      .reduce((boxes, color, i) => {
        const box = this.add.rectangle(
          i * 30 + (this.colorBoxSpacing + offset),
          29,
          this.colorBoxSize,
          this.colorBoxSize,
          color,
        ).setOrigin(0, 0)

        boxes.push(box)

        return boxes
      }, [])

    return colorBoxes
  }

  addPlayerSections() {
    this.player1Header = this.add.text(0, 0, this.text.player1)
    this.player2Header = this.add.text(0, 0, this.text.player2)
    this.chooseColor1Text = this.add.text(0, 30, this.text.chooseColor)
    this.chooseColor2Text = this.add.text(0, 30, this.text.chooseColor)

    const player1Elements = [
      this.player1Header,
      this.chooseColor1Text,
      ...this.createColorBoxes(this.chooseColor1Text.width),
      this.add.image(0, 70, 'WASD').setOrigin(0, 0),
      this.add.text(32, 160, this.text.controls),
    ]

    const player2Elements = [
      this.player2Header,
      this.chooseColor2Text,
      ...this.createColorBoxes(this.chooseColor2Text.width),
      this.add.image(0, 70, 'arrowKeys').setOrigin(0, 0),
      this.add.text(32, 160, this.text.controls),
    ]

    const getContainerWidth = (width, child) => {
      if (child.x + child.width > width) {
        width = child.x + child.width
      }

      return width
    }

    const container1Width = player1Elements.reduce(getContainerWidth, 0)
    const container2Width = player2Elements.reduce(getContainerWidth, 0)

    const container1X = (this.middleX - container1Width) * 2 / 3
    const container2X = this.middleX + (this.middleX - container2Width) / 3

    this.player1Container = this.add.container(container1X, 50, player1Elements)
    this.player2Container = this.add.container(container2X, 50, player2Elements)

    this.cursor1 = new Phaser.Geom.Triangle.BuildEquilateral(
      this.player1Container.x + this.chooseColor1Text.width + this.colorBoxSpacing + (this.colorBoxSize / 2),
      this.player1Container.y + 55,
      15,
    )

    this.cursor2 = new Phaser.Geom.Triangle.BuildEquilateral(
      // `+ 30` to begin on second color:
      this.player2Container.x + this.chooseColor2Text.width + this.colorBoxSpacing + (this.colorBoxSize / 2) + 30,
      this.player2Container.y + 55,
      15,
    )

    this.graphics = this.add.graphics({ fillStyle: { color: 0xFFFFFF } })
    this.graphics.fillTriangleShape(this.cursor1)
    this.graphics.fillTriangleShape(this.cursor2)
  }

  addGameInstructions() {
    this.add.text(this.middleX, 260, this.text.gameInstructionsHeader).setOrigin(0.5, 0)
    this.text.instructions.forEach((instruction, i) =>
      this.add.text(this.middleX, i * 20 + 300, instruction).setOrigin(0.5, 0),
    )
  }

  addGamePrompt() {
    this.add.text(this.middleX, 360, this.text.gamePrompt).setOrigin(0.5, 0)
  }

  handleKeyPress() {
    if (this.keyJustDown(this.enterKey)) {
      this.scene.start('game', {
        color1: this.colors[this.player1ColorIndex],
        color2: this.colors[this.player2ColorIndex],
      })
    }

    if (this.keyJustDown(this.keyD)) {
      if (this.player1ColorIndex === this.colors.length - 1) {
        this.player1ColorIndex = 0
        this.cursor1.left -= (30 * (this.colors.length - 1))
      } else {
        this.player1ColorIndex += 1
        this.cursor1.left += 30
      }
    }

    if (this.keyJustDown(this.keyA)) {
      if (this.player1ColorIndex === 0) {
        this.player1ColorIndex = this.colors.length - 1
        this.cursor1.left += (30 * (this.colors.length - 1))
      } else {
        this.player1ColorIndex -= 1
        this.cursor1.left -= 30
      }
    }

    if (this.keyJustDown(this.cursors.right)) {
      if (this.player2ColorIndex === this.colors.length - 1) {
        this.player2ColorIndex = 0
        this.cursor2.left -= (30 * (this.colors.length - 1))
      } else {
        this.player2ColorIndex += 1
        this.cursor2.left += 30
      }
    }

    if (this.keyJustDown(this.cursors.left)) {
      if (this.player2ColorIndex === 0) {
        this.player2ColorIndex = this.colors.length - 1
        this.cursor2.left += (30 * (this.colors.length - 1))
      } else {
        this.player2ColorIndex -= 1
        this.cursor2.left -= 30
      }
    }

    this.player1Header.setFill(`${this.colors[this.player1ColorIndex]}`)
    this.player2Header.setFill(`${this.colors[this.player2ColorIndex]}`)

    this.graphics.clear()
    this.graphics.fillTriangleShape(this.cursor1)
    this.graphics.fillTriangleShape(this.cursor2)
  }

  preload() {
    this.load.image('WASD', 'assets/WASD.png')
    this.load.image('arrowKeys', 'assets/arrowKeys.png')
  }

  create() {
    this.addMenuTitle()
    this.addPlayerSections()
    this.addGameInstructions()
    this.addGamePrompt()

    this.cursors = this.createCursorKeys()
    this.keyW = this.addKey('W')
    this.keyA = this.addKey('A')
    this.keyS = this.addKey('S')
    this.keyD = this.addKey('D')
    this.enterKey = this.addKey('ENTER')

    this.player1ColorIndex = 0
    this.player2ColorIndex = 1
  }

  update() {
    this.handleKeyPress()
  }
}
