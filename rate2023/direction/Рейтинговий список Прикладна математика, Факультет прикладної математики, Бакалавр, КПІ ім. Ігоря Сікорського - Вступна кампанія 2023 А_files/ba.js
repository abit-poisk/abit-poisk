$(function () {
    'use strict';

    function BannerManager(options) {
        this.options = options || [];
        var banners = this.options.banners || [];

        this.banners = banners.map(function (bannerData) {
            var type = typeof bannerData[0] === 'object' ? 'multi' : 'single';

            return {
                url: bannerData[0],
                link: bannerData[3],
                theme: bannerData[1],
                name: bannerData[2],
                type: type
            };
        });
    }

    BannerManager.prototype.getRandomBanner = function () {
        if (!this.banners.length) {
            return null;
        }

        var isMobile = $(document).width() < 769;

        if (!isMobile) {
            var banner =  this.banners[Math.floor(Math.random() * this.banners.length)];
            if (banner.type === 'single') {
                banner = this.banners[1];
            }

            return banner;
        }

        return this.banners[Math.floor(Math.random() * this.banners.length)];
    };

    BannerManager.prototype.renderBanner = function ($slot, banner) {
        console.log(banner);
        /*
        <img srcset="elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 600px) 480px,
            800px"
     src="elva-fairy-800w.jpg"
     alt="Elva dressed as a fairy">
         */

        if (banner.type === 'single') {
            var html = '<a href="'+banner.link+'" ' +
                'target="_blank" class="js-ba-banner-link" data-ba-theme="'+banner.theme+'" data-ba-name="'+banner.name+'">' +
                '<img style="height: auto;max-width: 100%;" src="'+banner.url+'" alt="banner"/>'
                +'</a>';

            $slot.addClass('visible-sm-block visible-xs-block')
        } else {
            var html = '<a href="'+banner.link+'" style="width: 100%;display: block" ' +
                'target="_blank" class="js-ba-banner-link" data-ba-theme="'+banner.theme+'" data-ba-name="'+banner.name+'">' +
                '<picture>' +
                '  <source media="(max-width: 767px)" srcset="'+banner.url.mobile+'">\n' +
                '  <source media="(min-width: 768px)" srcset="'+banner.url.desktop+'">\n' +
                '<img style="height: auto;max-width: 100%;max-height: 80px" src="'+banner.url.desktop+'" alt="banner"/>' +
            '</picture>'
            +'</a>';

            if (banner.url.bg) {
                $slot.css('background', banner.url.bg);
            }
        }

        $slot.html(html).find('img').on('load', function () {
            var newHeight = $(this).height();
            newHeight && $slot.css('min-height', newHeight);
        })
    };

    BannerManager.prototype.init = function () {
        if (!this.banners.length) {
            return;
        }

        var self = this;

        $(document).on('click', this.options.selectors.bannerLink, function (e) {
            var $link = $(this),
                bannerName = $link.data('ba-name') || '',
                bannerTheme = $link.data('ba-theme') || '',
                eventLabel = (bannerName || bannerTheme) ? ([bannerName, bannerTheme].join('-')) : '';

            gtag && gtag('event', 'banner-click', {
                'event_category': 'ad',
                'event_label': eventLabel,
            });
        });

        $(this.options.selectors.slot).each(function () {
            var $slot = $(this),
                randomBanner = self.getRandomBanner();

            if (randomBanner) {
                self.renderBanner($slot, randomBanner);
            }
        });
    };

    var bannerManager = new BannerManager($('#js-ba-options').data('options'));

    bannerManager.init();
});