// ---------------------------------------------------------------------------------------------------------------------
// Sticky
//
// @module sticky.js
// ---------------------------------------------------------------------------------------------------------------------

function StickyFactory($document)
{
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function(scope, elem, attrs)
        {
            elem.css('display', 'block');
            scope.fixed = false;

            var child = elem.children();

            $document.on('scroll', function(event)
            {
                var elemRect = elem[0].getBoundingClientRect();
                scope.$apply(function()
                {
                    if(elemRect.top < 0)
                    {
                        elem.css('min-height', child[0].getBoundingClientRect().height + 'px');
                        child.css('top', '0');
                        child.css('width', '100%');
                        child.css('z-index', '1000');
                        child.css('position', 'fixed');
                    }
                    else
                    {
                        elem.css('min-height', 'inherit');
                        child.css('top', 'inherit');
                        child.css('width', 'inherit');
                        child.css('z-index', 'inherit');
                        child.css('position', 'inherit');
                    } // end if
                });
            });
        }
    };
} // end StickyFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('sticky', ['$document', StickyFactory]);

// ---------------------------------------------------------------------------------------------------------------------