// ==UserScript==
// @name         Timmi ESS Fusion
// @namespace    https://github.com/draganignjic/timmi-ess-fusion/
// @version      0.9.7
// @description  Embed ESS Timesheet in Lucca Timmi - Now opening in a pop up instead of iframe because of Timmi Security Restrictions (CSP)
// @author       Dragan Ignjic (Saferpay)
// @include      /sps.ilucca.ch/timmi
// @include      /sap/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js
// @downloadURL  https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js
// @updateURL    https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js
// ==/UserScript==

(async () => {

    let _updateUrl = "https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js";
    let _modernEssLoginUrl = "https://gateway.corp.worldline.com/sap/flp?run-mode=standalone&sap-theme=wlbluecrystal@/sap/public/bc/themes/~client-360&appState=lean#Timesheet-entryv2";

    if (scriptAlreadyExecuted()) {
        // some users have it installed twice
        return;
    }

    if (window.location.href.indexOf('/timmi') !== -1 && window.location.href.indexOf('/login') == -1 && window.location.href.indexOf('/timmi-absences') == -1) {
        if (isInIframe()) {
            // timmi has iframes which we don't want to run ess in
            return;
        }

        appendEssButtons();
        collectTimmiHours();
    }

    if (window.location.href.indexOf('/sap/flp') !== -1 && window.location.href.indexOf('#Timesheet-entry') !== -1) {
        listenForTimmiHoursModernEss();
        changeShowWeekendDefault();
        addEndOfMonthWarningModernEss();
        addFillButtonsModernEss();
        makeModernEssCompact();
        setEssWindowTitle();
        breakOutOfIframe();
    }

    function setEssWindowTitle() {
        document.title = 'ESS Timesheet - powered by Timmi ESS Fusion script and Tampermonkey';
        setTimeout(setEssWindowTitle, 1000);
    }

    function makeModernEssCompact() {

        $('#shell-hdr').css('z-index', 0); // Enable week "<" and ">" buttons

        $('.jss34')
            .css('margin-left', 'unset')
            .css('max-width', 'unset');

        // Make sure that WBS name not truncated. Sometimes there are wbs with similar name which only differ at the the end.
        $('main div').css('overflow', 'visible');

        setTimeout(makeModernEssCompact, 500);
    }

    function changeShowWeekendDefault() {

        if (!getCookie('showWeekends')) {
            setCookie('showWeekends', 'false;SameSite=None;Secure');
        }
    }

    function scriptAlreadyExecuted() {

        var duplicateExecutionId = 'timmi-ess-fusion-prevent-duplicate-execution';
        if ($('#' + duplicateExecutionId).length != 0){
            return true;
        }
        $('body').append($('<div id="' + duplicateExecutionId + '" style="display:none"></div>'));
        return false;
    }

    function breakOutOfIframe() {

        if (isModernTimeEntryDisplayed()) {
            if(this != top) {
                top.location.href = this.location.href;
            }
        }
        setTimeout(breakOutOfIframe, 1000);
    }

    function isModernTimeEntryDisplayed() {

        return $('#sap-ui-static').length != 0;
    }


    let _loginWindow = null;

    function openPopup(url, title, w, h) {

        if (_loginWindow && !_loginWindow.closed) {
            _loginWindow.focus();
            return;
        }

        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

        const width = screen.width;
        const height = screen.height;

        const systemZoom = 1;
        const left = (width - w - 50) / systemZoom + dualScreenLeft
        const top = (height - h - 150) / systemZoom + dualScreenTop
        const newWindow = window.open(url, title,`scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`);

        if (window.focus) newWindow.focus();

        window.onbeforeunload = function(event) { _loginWindow.close() };

        _loginWindow = newWindow;
    }

    function appendEssButtons() {

        if ($('.pageLayout-container-main-content').length == 0) {
            setTimeout(appendEssButtons, 1000);
            return;
        }

        appendHelpBox();

        var loginBtn = $('<button id="loginBtn">ESS</button>');
        $('body').append(loginBtn);
        setButtonStyle(loginBtn);
        loginBtn
            .css('width','150px')
            .css('height','40px')
            .css('bottom','15px')
            .css('left','min(1250px, calc(100% - 470px))');

        loginBtn.click(function(e) {
            openPopup(_modernEssLoginUrl,'ESS Login', 1300, 750);
        });
    }

    function appendHelpBox() {

        var helpBtn = $('<a href="javascript:void()">ESS Help</a>');
        setButtonStyle(helpBtn)
        helpBtn.click(function() {
            $('#helpBox').toggle();
        });
        $('body').append(helpBtn);
        helpBtn
            .css('width','150px')
            .css('height','40px')
            .css('bottom','15px')
            .css('left','min(1090px, calc(100% - 630px))')
            .css('background-color', 'white')
            .css('padding', '7px')
            .css('border', '1px solid lightgray')
            .css('color', 'rgb(42, 53, 81)');

        var emailHiddenFromWebCrawler = 'c2lwOmRyYWdhbi5pZ25qaWNAd29ybGRsaW5lLmNvbQ==';

        var helpBox = $(`<div id="helpBox">
        <b>ESS Login Problems</b><a id="closeHelpBtn" href="javascript:void();" style="float:right;text-decoration:none;">close</a><br>
        If you cannot login to ESS try following:
        <ul style="margin-top: 5px">
            <li>Restart your Browser.</li>
            <li>Login into the <a href="https://www.corp.worldline.com" target="_blank">worldline portal</a> in another browser tab and then return here.</li>
            <li>Update the Timmi ESS Script <a href="` + _updateUrl + `" target="_blank">here</a></li>
            <li>Contact the Support in <a href="` + atob(emailHiddenFromWebCrawler) + `">MS Teams</a></li>
            <li><a href="https://one.myworldline.com/en/global/working-at-worldline/Timesheet" target="_blank">More info<a></li>
        </ul>
        <br>

        </div>`);
        $('body').append(helpBox);
        helpBox
            .css('background-color', 'white')
            .css('border', '1px solid lightgray')
            .css('border-radius', '10px')
            .css('position', 'fixed')
            .css('bottom', '62px')
            .css('left','min(1249px, calc(100% - 470px))')
            .css('width', '457px')
            .css('height', '219px')
            .css('z-index', 1000)
            .css('font-family', 'arial')
            .css('font-size', '14px')
            .css('padding', '10px');
        helpBox.hide();

        $('#closeHelpBtn').click(function() {
            helpBox.hide();
        });
    }

    function setButtonStyle(btn) {

        btn
            .css('position','fixed')
            .css('z-index','100')
            .css('display','inline-block')

            .css('text-decoration','none')
            .css('background-color','#66A3C7')

            .css('border','0')
            .css('border-radius','5px')

            .css('cursor','pointer')

            .css('white-space','nowrap')
            .css('veritcal-align','middle')
            .css('text-align','center')
            .css('padding','0')

            .css('color','white')
            .css('font-family','"Source Sans Pro", Tahoma, sans-serif')
            .css('font-size','16px');
    }

    function collectTimmiHours() {

        setTimeout(collectTimmiHours, 500);

        var dateText = $('tt-timesheet-picker span').eq(0).text()?.trim();
        if (!dateText) {
            return;
        }

        var month = moment(dateText, 'MMMM', $('html').attr('lang'));

        $('tt-date-display').each(function() {
            var dayNumber = $(this).find('span').eq(0).text().replace(/\D/g, '');
            var day = month.clone().set("date", dayNumber)
            let totalHours = 0;

            var hoursAndMinutes = $(this).parent().find('.timeProgress-time-text').find('span').eq(0).text();
            if (hoursAndMinutes) {
                const hoursAndMinutesRegex = new RegExp("([0-9]{1,2})[A-Za-z\. ]*?([0-9]{2})");
                let matchGroups = hoursAndMinutes.match(hoursAndMinutesRegex);
                var hours = parseInt(matchGroups[1]);
                var minutes = matchGroups[2];
                totalHours = hours + minutes / 60;
            }

            if (_loginWindow) {
                _loginWindow.postMessage({
                    day: day.format('YYYY-MM-DD'),
                    totalHours: totalHours
                }, '*');
            }

        });
    }

    function getFirstDayOfWeek() {

        if ($('#mainContainer').length == 0) {
            return;
        }
        var firstDay = $('#mainContainer').text().replace('Mo ','');
        firstDay += '/' + new Date().getFullYear();
        return moment(firstDay , 'DD/MM/YYYY');
    }

    function listenForTimmiHoursModernEss() {

        $(window).on('message', function (e) {

            var firstDayOfWeek = getFirstDayOfWeek();
            if (!firstDayOfWeek) {
                return;
            }

            $('footer span:contains("/")').each(function(dayOfWeek) {

                var currentDay = firstDayOfWeek.clone().add(dayOfWeek, 'days');

                if (currentDay.format('YYYY-MM-DD') == e.originalEvent.data.day) {

                    var fillButtons = $('.fillDayBtn[day="' + currentDay.format('YYYY-MM-DD') + '"]');
                    fillButtons.hide();

                    var diffCell = $(this);
                    diffCell.val('')
                        .css('background-color', '')
                        .css('color', '#6D6D6D')
                        .css('padding', '4px')
                        .css('border-radius', '0 4px 4px 0');

                    diffCell.prev()
                        .css('background-color', '')
                        .css('color', '#6D6D6D')
                        .css('padding', '4px')
                        .css('border-radius', '4px 0 0 4px');

                    var timmiHours = parseFloat(e.originalEvent.data.totalHours);
                    if (!timmiHours) {
                        return;
                    }

                    var decimalPlaces = 2;

                    var newValueForDiffCell = timmiHours.toFixed(decimalPlaces).replace('.',',');
                    var essHoursRaw = diffCell.prev().text();
                    if (essHoursRaw.indexOf(':') !== -1) {
                        essHoursRaw = moment.duration(essHoursRaw).asHours();
                        newValueForDiffCell = convertDecimalHoursToHoursAndMinutes(newValueForDiffCell);
                    }
                    else {
                        essHoursRaw = essHoursRaw.replace(',','.')
                    }
                    var essHours = parseFloat(essHoursRaw);

                    diffCell.html(' /&nbsp;' + newValueForDiffCell);

                    var diff = essHours - timmiHours;

                    if (parseFloat(Math.abs(diff.toFixed(decimalPlaces))) > 0.01) {
                        diffCell
                            .css('background-color', 'lightcoral')
                            .css('color','white');
                        diffCell.prev()
                            .css('background-color', 'lightcoral')
                            .css('color','white');

                        diffCell.attr('dayTotalDiffCellDate', currentDay.format('YYYY-MM-DD'));
                        diffCell.attr('dayTotalDiffCellDiffValue', diff.toFixed(decimalPlaces));
                        diffCell.attr('dayTotalDiffCellEssHours', essHours);

                        if (diff < 0){
                            diffCell.attr('title', 'You have ' + Math.abs(diff).toFixed(decimalPlaces) + ' hours more in Timmi compared to ESS');
                        }
                        else {
                            diffCell.attr('title', 'You have ' + diff.toFixed(decimalPlaces) + ' hours more in ESS compared to Timmi');
                        }
                        fillButtons.each(function(){
                            var hourInCell = parseFloat(diff);
                            if (hourInCell > 0 || diff < 0) {
                                $(this).show();
                            }
                        });
                    }
                    else {
                        diffCell
                            .css('background-color', '#c7ebe8')
                            .css('color','#00A59C');
                        diffCell.prev()
                            .css('background-color', '#c7ebe8')
                            .css('color','#00A59C');
                    }
                }
            });
        });
    }

    function convertDecimalHoursToHoursAndMinutes(hoursWithDecimals) {

        var parts = hoursWithDecimals.replace('.',',').split(',');
        var hours = parts[0];
        var decimalHours = parts[1] || 0;
        var minutes = Math.round(decimalHours * 0.6);
        if (minutes < 10) {
            minutes += '0';
        }
        return hours + ':' + minutes;
    }

    function addEndOfMonthWarningModernEss() {

        setTimeout(function() { addEndOfMonthWarningModernEss(); }, 100);

        if ($('#mainHeader').length == 0) {
            // not loaded yet
            return;
        }

        var warnUser = false;

        var secondLastWorkday = getSecondLastWorkdayOfMonth();
        $('span').each(function() {
            if ($(this).text().indexOf(secondLastWorkday.format('DD/MM')) != -1) {
                $(this).css('background-color','lightyellow');
                $(this).css('border-radius','5px');
                warnUser = true;
            }
        });

        if ($('#monthEndWarning').length == 0) {
            var text = secondLastWorkday.format('dddd DD.MM.YYYY') + ' is the second last working day of ' + secondLastWorkday.format('MMMM') + '. You should fill out and release the whole month no later than ' + secondLastWorkday.format('dddd') + '.';
            $('#mainHeader').parent().parent()
                    .append($('<span style="background-color:lightyellow;padding:5px;font-size:12px;border-radius:5px;" id="monthEndWarning">' + text + '</span>'))
                    .removeClass('MuiGrid-grid-xs-6')
                    .addClass('MuiGrid-grid-xs-11')
                    .next()
                    .removeClass('MuiGrid-grid-xs-6')
                    .addClass('MuiGrid-grid-xs-1');
        }

        if (!warnUser) {
            $('#monthEndWarning').hide();
        }
        else {
            $('#monthEndWarning').show();
        }
    }

    function isInIframe(){
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function addFillButtonsModernEss() {

        setTimeout(function() { addFillButtonsModernEss(); }, 100);

        var firstDayOfWeek = getFirstDayOfWeek();
        if (!firstDayOfWeek) {
            // not loaded yet
            return;
        }

        if ($('.fillDayBtn').length != 0) {
            // already added
            return;
        }

        $('input.MuiInputBase-input:not([readonly])').each(function(){
            var fillDayBtn = $('<a href="javascript:void(0);" class="fillDayBtn">Fill</a>');
            fillDayBtn.hide(); // avoid showing buttons from other month
            fillDayBtn.insertBefore($(this).parent());

            var dayOfWeek = $(this).closest('.MuiGrid-container').find('input.MuiInputBase-input:not([readonly])').index(this);

            var currentDay = firstDayOfWeek.clone().add(dayOfWeek, 'days');
            $(this).attr('day', currentDay.format('YYYY-MM-DD'));
            fillDayBtn.attr('day', currentDay.format('YYYY-MM-DD'));
        });

        var btn = $('.fillDayBtn');
        btn.css('font-size', '9px');
        btn.css('margin-right', '6px');
        btn.css('margin-left', '5px');
        btn.css('cursor', 'pointer');
        btn.css('vertical-align','middle');
        btn.attr('title', 'fill / remove the remaining hours from Timmi here');

        btn.click(function() {
            if (fillCellWithDayDiffModernEss($(this).next().find('input'))){
                $('button>span:contains("Save")')
                    .focus()
                    .click();
            }
        });

        return;
    }

    function fillCellWithDayDiffModernEss(element) {

        var essTotal = $('[dayTotalDiffCellDate="' + element.attr('day') + '"]').attr('dayTotalDiffCellEssHours');
        var diffCell = $('[dayTotalDiffCellDate="' + element.attr('day') + '"]');
        var diff = parseFloat(diffCell.attr('dayTotalDiffCellDiffValue').replace(',','.'));
        if (!diff) {
            alert('There are no hours to fill');
            return false;
        }
        var timeInCell = element.val().replace(',','.');
        if (diffCell.text().indexOf(':') !== -1) {
            timeInCell = moment.duration(timeInCell).asHours();
        }
        var currentHours = parseFloat(timeInCell) || 0;
        if (currentHours < diff){
            currentHours = 0;
            diff = 0;
        }

        var newValue = Math.abs(currentHours - diff).toFixed(2).replace('.',',');
        if (diffCell.text().indexOf(':') !== -1) {
            newValue = convertDecimalHoursToHoursAndMinutes(newValue);
        }
        if (newValue == '0:00' || newValue == '0,00') {
            newValue = '';
        }
        setValueOfReactInputField(element[0], newValue);

        return true;
    }

    function setValueOfReactInputField(element, value) {

        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function setCookie(name,value,days) {

        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {

        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function deleteCookie(name) {

        document.cookie = name+'=; Max-Age=-99999999;';
    }

    function deleteAllCookies() {

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function getSecondLastWorkdayOfMonth() {

        var endOfMonth = moment().endOf('M');
        switch(endOfMonth.isoWeekday()) {
            case 1:
                return endOfMonth.subtract(3, 'days');
            case 2:
            case 3:
            case 4:
            case 5:
                return endOfMonth.subtract(1, 'days');
            case 6:
                return endOfMonth.subtract(2, 'days');
            case 7:
                return endOfMonth.subtract(3, 'days');
        }
    }
})();
