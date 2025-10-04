<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $duration = 3600): Response
    {
        $response = $next($request);

        // Only cache GET requests with successful responses
        if ($request->method() === 'GET' && $response->getStatusCode() === 200) {
            // Set Cache-Control headers for browser caching
            $response->headers->set('Cache-Control', "public, max-age={$duration}");
            
            // Set ETag for validation
            $etag = md5($response->getContent());
            $response->setEtag($etag);
            
            // Set Last-Modified
            $response->setLastModified(new \DateTime());
            
            // Check if the client has a fresh enough copy
            if ($response->isNotModified($request)) {
                return $response;
            }
        }

        return $response;
    }
}
