odoo.define('website_portal.files', function (require) {
        "use strict";
        var rpc = require('web.rpc')
        var publicWidget = require('web.public.widget');
        var time = require('web.time');
        const session = require('web.session');

        publicWidget.registry.CustomerPortal = publicWidget.Widget.extend({
            selector: '.new_timeoff_form',
            events: {
                'change .lesson_plan_file': 'update_file_to',
                'change .attachment_1': 'update_attachment_1',
                'change .attachment_2': 'update_attachment_2',
                'change .attachment_3': 'update_attachment_3',
                'change .attachment_4': 'update_attachment_4',
                'change .attachment_5': 'update_attachment_5',
                'change .attachment_6': 'update_attachment_6',
            },


            update_file_to: function (ev) {
                console.log('zzzzzzzzzzzzzzzz', ev.currentTarget.value)
                if (ev.currentTarget.value === '') {
                    document.getElementById('base64').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base64').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }

            },
            update_attachment_1: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base641').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base641').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name1').value = filename;
                }
            },
            update_attachment_2: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base642').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base642').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name2').value = filename;
                }
            },
            update_attachment_3: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base643').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base643').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name3').value = filename;
                }
            },
            update_attachment_4: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base644').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base644').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name4').value = filename;
                }
            },
            update_attachment_5: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base645').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base645').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name5').value = filename;
                }
            },
            update_attachment_6: function (ev) {
                if (ev.currentTarget.value === '') {
                    document.getElementById('base646').value = '';

                } else {
                    var f = ev.currentTarget.files[0];
                    var reader = new FileReader();

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var binaryData = e.target.result;
                            //Converting Binary Data to base 64
                            var base64String = window.btoa(binaryData);
                            //showing file converted to base64
                            document.getElementById('base646').value = base64String;
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsBinaryString(f);

                }
                var fullPath = ev.currentTarget.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }
                    document.getElementById('file_name6').value = filename;
                }
            },


        });

    }
);
