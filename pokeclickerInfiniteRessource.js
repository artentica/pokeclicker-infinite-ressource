// ==UserScript==
// @name        [Pokeclicker] Add ressource
// @namespace   Pokeclicker Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.0.0
// @author      Artentica
// @description Adds buttons to allow ressources to be added (dungeon token, money, quest token or refill energy in the underground).
// ==/UserScript==


let autoRefillEnergyUnderground,
    autoRefillEnergyUndergroundState,
    autoRefillEnergyUndergroundTimer,
    autoRefillEnergyUndergroundColor,
    scriptName = "pokeclickerInfiniteRessource",
    ressourcePanelAbovePokemonBattle = document.getElementById('battleContainer').children[0].children[0],
    undergroundDigModal = document.getElementById('dig').children[0],
    undergroundDigModalUl = document.getElementById('mineModal').getElementsByClassName('modal-header')[0].children[0].children,
    farmModalUl = document.getElementById('farmModal').getElementsByClassName('modal-header')[0].children[0].children,
    XPHeaderQuestList = document.getElementById('QuestModal').getElementsByClassName('modal-header')[0].children,
    addGemTimer

function initInfiniteRessource() {

    // Energy refill in underground
    if (autoRefillEnergyUndergroundState == "ON") {
        autoRefillEnergyUndergroundTimer = setInterval(function() {
            App.game.underground.energy = App.game.underground.getMaxEnergy()
        }, 2500)
    }
    if (autoRefillEnergyUndergroundState == "OFF") {
        autoRefillEnergyUndergroundColor = "danger"
    } else {
        autoRefillEnergyUndergroundColor = "success"
    }

    let elementToTheUnderground = document.createElement("div")
    elementToTheUnderground.innerHTML = `<div class="row justify-content-center py-0">
        <div class="col-4 pr-0">
            <button id="auto-refill-energy-start" class="btn btn-` + autoRefillEnergyUndergroundColor + ` btn-block" style="font-size:9pt;">
                Auto Refill Energy [` + autoRefillEnergyUndergroundState + `]
            </button>
        </div>
    </div>`
    undergroundDigModal.after(elementToTheUnderground)

    $("#auto-refill-energy-start").click(startAutoRefillEnergy);

    function startAutoRefillEnergy() {
        if (autoRefillEnergyUndergroundState == "OFF") {
            localStorage.setItem("autoRefillEnergyUndergroundState", "ON");
            autoRefillEnergyUndergroundState = "ON"
            autoRefillEnergyUndergroundTimer = setInterval(function() {
                App.game.underground.energy = App.game.underground.getMaxEnergy()
            }, 2500);
            document.getElementById('auto-refill-energy-start').innerText = `Auto Refill Energy [ ${autoRefillEnergyUndergroundState} ]`
            document.getElementById('auto-refill-energy-start').classList.remove('btn-danger');
            document.getElementById('auto-refill-energy-start').classList.add('btn-success');
        } else {
            endAutoRefillEnergy();
        }
    }

    function endAutoRefillEnergy() {
        localStorage.setItem("autoRefillEnergyUndergroundState", "OFF");
        autoRefillEnergyUndergroundState = "OFF"
        document.getElementById('auto-refill-energy-start').innerText = `Auto Refill Energy [ ${autoRefillEnergyUndergroundState} ]`
        document.getElementById('auto-refill-energy-start').classList.remove('btn-success');
        document.getElementById('auto-refill-energy-start').classList.add('btn-danger');
        clearInterval(autoRefillEnergyUndergroundTimer)
    }

    // Add ressources Money/Dungeon/Quest
    let elementToAddRessources = document.createElement("table")
    elementToAddRessources.style.width = "100%";
    elementToAddRessources.innerHTML = `
        <tbody>
            <tr class="row" style="margin: 0;">
                <td class="col" style="margin: 0px 10px; padding: 0;">
                    <button class="btn btn-block btn-primary" id="add-gold" style="height: 100%;">Add 10M <img title="Money to add" src="assets/images/currency/money.svg" height="25px"></button>
                </td>
                <td class="col" style="margin: 0px 10px; padding: 0;">
                    <button class="btn btn-block btn-primary" id="add-dungeon-token" style="height: 100%;">Add 2M <img title="Dungeon token to add" src="assets/images/currency/dungeonToken.svg" height="25px"></button>
                </td>
                <td class="col" style="margin: 0px 10px; padding: 0;">
                    <button class="btn btn-block btn-primary" id="add-quest-token" style="height: 100%;">Add 50K <img title="Quest point to add" src="assets/images/currency/questPoint.svg" height="25px"></button>
                </td>
            </tr>
        </tbody>`
    ressourcePanelAbovePokemonBattle.after(elementToAddRessources)

    $("#add-gold").click(() => App.game.wallet.gainMoney(10000000, true));
    $("#add-dungeon-token").click(() => App.game.wallet.gainDungeonTokens(2000000, true));
    $("#add-quest-token").click(() => App.game.wallet.gainQuestPoints(50000));


    // Add ressources Diamond
    let elementToAddRessourcesDiamond = document.createElement("btn")
    elementToAddRessourcesDiamond.classList.add('btn')
    elementToAddRessourcesDiamond.classList.add('btn-primary')
    elementToAddRessourcesDiamond.setAttribute('id', 'add-diamond')
    elementToAddRessourcesDiamond.innerHTML = `Add 1k <img title="Diamonds to add" src="assets/images/underground/diamond.svg" width="20px">`

    undergroundDigModalUl[undergroundDigModalUl.length - 1].after(elementToAddRessourcesDiamond)
    $("#add-diamond").click(() => App.game.wallet.gainDiamonds(1000))


    // Add ressources Farm Token
    let elementToAddRessourcesFarmToken = document.createElement("btn")
    elementToAddRessourcesFarmToken.classList.add('btn')
    elementToAddRessourcesFarmToken.classList.add('-btn-primary')
    elementToAddRessourcesFarmToken.setAttribute('id', 'add-farm-token')
    elementToAddRessourcesFarmToken.innerHTML = `Add 10k <img title="Farm points to add" src="assets/images/currency/farmPoint.svg" width="20px">`

    farmModalUl[farmModalUl.length - 1].after(elementToAddRessourcesFarmToken)
    $("#add-farm-token").click(() => App.game.wallet.gainFarmPoints(10000))


    // Add a quest level
    let elementToAddQuestLvl = document.createElement("div")
    elementToAddQuestLvl.classList.add('col-2')
    elementToAddQuestLvl.innerHTML = `<button class="btn btn-primary" id="add-lvl-quest" style="height: 100%;float: right;">Add 1Lvl</button>`
    XPHeaderQuestList[1].classList.remove('col-6')
    XPHeaderQuestList[1].classList.add('col-4')

    XPHeaderQuestList[1].after(elementToAddQuestLvl)
    $("#add-lvl-quest").click(() => App.game.quests.addXP(App.game.quests.levelToXP(App.game.quests.level() + 1) - App.game.quests.xp()))


    // Add a gem button only after the game is started
    addGemTimer = setInterval(function() {
        if (App.game) {
            clearInterval(addGemTimer)
            addGemButton()
        }
    }, 2500);

    function addGemButton() {
        let gemlist = document.getElementById('gemModal').getElementsByClassName('modal-body')[0].children[1].querySelectorAll('thead')
        gemlist.forEach((el, idx) => {
            let elementToAddGem = document.createElement("button")
            elementToAddGem.classList.add('btn')
            elementToAddGem.classList.add('btn-primary')
            elementToAddGem.style = "height: 100%; float: right; margin: auto 20px;"
            elementToAddGem.setAttribute('id', `add-gem-${idx}`)
            elementToAddGem.innerHTML = `Add 10k <img title="${PokemonType[idx]} gems to add" src="${Gems.image(idx)}">`

            el.getElementsByClassName('float-right')[0].before(elementToAddGem)
            $(`#add-gem-${idx}`).click((event) => {
                event.stopPropagation()
                App.game.gems.gainGems(10000, idx)
            })
        })
    }

}


if (localStorage.getItem('autoRefillEnergyUndergroundState') == null) {
    localStorage.setItem("autoRefillEnergyUndergroundState", "OFF");
}
autoRefillEnergyUndergroundState = localStorage.getItem('autoRefillEnergyUndergroundState');

function loadScript() {
    var oldInit = Preload.hideSplashScreen

    Preload.hideSplashScreen = function() {
        var result = oldInit.apply(this, arguments)
        initInfiniteRessource()
        return result
    }
}

;
(function() {
    'use strict'

    console.log(`${scriptName} lauched`)
    loadScript()
})()